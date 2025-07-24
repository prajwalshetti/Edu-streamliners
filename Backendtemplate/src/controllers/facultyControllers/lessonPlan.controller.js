import { LessonPlan } from '../../models/LessonPlan.models.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { buildLessonPlanPrompt } from '../../utils/lessonPhraser.js';
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
async function rephrase(content) {
    try {
      const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: content,
        });
        console.log(response.text);
        let clean = response.text.replace(/```json|```/g, '').trim();  
        return clean
    } catch (error) {
      console.error("Error rephrasing content:", error);
      throw error; // Rethrow the error to be handled by the caller 
    }
  }

// Create new lesson plan
export const createLessonPlan = asyncHandler(async (req, res) => {
    const aiResponseText = await rephrase(buildLessonPlanPrompt(req.body));
console.log("came to create lesson plan from AI", aiResponseText);

let lessonData;
try {
    lessonData = JSON.parse(aiResponseText); // Ensure the response is a proper JSON string
} catch (err) {
    console.error("Failed to parse AI response:", err);
    throw new ApiError(500, "Invalid AI response format");
}

// Validate required fields again (in case AI messed up)
const requiredFields = ["title", "subject", "grade", "section", "date", "duration"];
for (const field of requiredFields) {
    if (!lessonData[field]) {
        throw new ApiError(400, `Missing required field: ${field}`);
    }
}

// Add teacher ID to the lesson data
lessonData.teacher = req.user._id;

// Save to DB
const lessonPlan = await LessonPlan.create(lessonData);

return res.status(201).json(
    new ApiResponse(201, lessonPlan, "Lesson plan created successfully")
);
});

// Get all lesson plans for a teacher with filters
export const getLessonPlans = asyncHandler(async (req, res) => {
    console.log("came to getLessonPlans");
    
    const {
        status,
        subject,
        grade,
        section,
        startDate,
        endDate,
        page = 1,
        limit = 10
    } = req.query;

    const filter = { teacher: req.user._id };

    // Apply filters
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const lessonPlans = await LessonPlan.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

    const total = await LessonPlan.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {
            lessonPlans,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        }, "Lesson plans retrieved successfully")
    );
});

// Get lesson plan by ID
export const getLessonPlanById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const lessonPlan = await LessonPlan.findOne({
        _id: id,
        teacher: req.user._id
    });

    if (!lessonPlan) {
        throw new ApiError(404, "Lesson plan not found");
    }

    return res.status(200).json(
        new ApiResponse(200, lessonPlan, "Lesson plan retrieved successfully")
    );
});

// Update lesson plan
export const updateLessonPlan = asyncHandler(async (req, res) => {
    console.log("came to updateLessonPlan");
    
    const { id } = req.params;
    const updates = req.body;

    const lessonPlan = await LessonPlan.findOneAndUpdate(
        { _id: id, teacher: req.user._id },
        { 
            ...updates,
            lastModified: Date.now()
        },
        { new: true, runValidators: true }
    );

    if (!lessonPlan) {
        throw new ApiError(404, "Lesson plan not found");
    }

    return res.status(200).json(
        new ApiResponse(200, lessonPlan, "Lesson plan updated successfully")
    );
});

// Delete lesson plan
export const deleteLessonPlan = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const lessonPlan = await LessonPlan.findOneAndDelete({
        _id: id,
        teacher: req.user._id
    });

    if (!lessonPlan) {
        throw new ApiError(404, "Lesson plan not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Lesson plan deleted successfully")
    );
});

// Change lesson plan status
export const updateLessonPlanStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, comments } = req.body;

    if (!['Draft', 'Pending', 'Approved', 'Completed', 'Cancelled'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const updateData = {
        status,
        lastModified: Date.now()
    };

    // If status is being set to Approved, add approval details
    if (status === 'Approved') {
        updateData.approvalDetails = {
            approvedBy: req.user._id,
            approvedAt: Date.now(),
            comments
        };
    }

    const lessonPlan = await LessonPlan.findOneAndUpdate(
        { _id: id, teacher: req.user._id },
        updateData,
        { new: true }
    );

    if (!lessonPlan) {
        throw new ApiError(404, "Lesson plan not found");
    }

    return res.status(200).json(
        new ApiResponse(200, lessonPlan, "Lesson plan status updated successfully")
    );
});

// Get lesson plan statistics
export const getLessonPlanStats = asyncHandler(async (req, res) => {
    // Get base stats for different statuses
    const statusStats = await LessonPlan.aggregate([
        { $match: { teacher: req.user._id } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    // Transform status stats into required format
    const formattedStats = {
        total: 0,
        completed: 0,
        pending: 0,
        draft: 0,
        cancelled: 0
    };

    statusStats.forEach(stat => {
        formattedStats.total += stat.count;
        switch(stat._id) {
            case 'Completed':
                formattedStats.completed = stat.count;
                break;
            case 'Pending':
                formattedStats.pending = stat.count;
                break;
            case 'Draft':
                formattedStats.draft = stat.count;
                break;
            case 'Cancelled':
                formattedStats.cancelled = stat.count;
                break;
        }
    });

    // Get monthly trends for comparison
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const monthlyTrends = await LessonPlan.aggregate([
        {
            $match: {
                teacher: req.user._id,
                createdAt: { $gte: previousMonth }
            }
        },
        {
            $group: {
                _id: {
                    status: '$status',
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        }
    ]);

    // Calculate trend percentages
    const currentMonth = new Date().getMonth() + 1;
    const lastMonth = currentMonth - 1 || 12;

    const calculateTrend = (status) => {
        const current = monthlyTrends.find(t => t._id.status === status && t._id.month === currentMonth)?.count || 0;
        const previous = monthlyTrends.find(t => t._id.status === status && t._id.month === lastMonth)?.count || 0;
        
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    const statsWithTrends = {
        ...formattedStats,
        trends: {
            total: calculateTrend(null),
            completed: calculateTrend('Completed'),
            pending: calculateTrend('Pending'),
            draft: calculateTrend('Draft')
        }
    };

    // Get subject distribution
    const subjectStats = await LessonPlan.aggregate([
        { $match: { teacher: req.user._id } },
        {
            $group: {
                _id: '$subject',
                count: { $sum: 1 }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            stats: statsWithTrends,
            subjectDistribution: subjectStats
        }, "Statistics retrieved successfully")
    );
});