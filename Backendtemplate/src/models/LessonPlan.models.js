import mongoose from 'mongoose';

const lessonPlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    learningObjectives: {
        type: [String],
        required: true
    },
    prerequisiteKnowledge: {
        type: String,
        default: ''
    },
    teachingMethods: {
        type: [String],
        required: true
    },
    materials: {
        type: [String],
        default: []
    },
    lessonStructure: {
        introduction: {
            type: String,
            required: true
        },
        mainContent: {
            type: String,
            required: true
        },
        conclusion: {
            type: String,
            required: true
        },
        assessment: {
            type: String,
            default: ''
        }
    },
    homework: {
        type: String,
        default: ''
    },
    differentiation: {
        struggling: {
            type: String,
            default: ''
        },
        advanced: {
            type: String,
            default: ''
        }
    },
    reflection: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Approved', 'Completed', 'Cancelled'],
        default: 'Draft'
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    approvalDetails: {
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        approvedAt: Date,
        comments: String
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for frequent queries
lessonPlanSchema.index({ teacher: 1, date: -1 });
lessonPlanSchema.index({ status: 1 });

export const LessonPlan = mongoose.model('LessonPlan', lessonPlanSchema);