// src/controllers/chatbot.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import {Student} from "../models/student.models.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Prompt template
const PROMPT_TEMPLATE = `You are a MongoDB query generator for a student information system. Convert natural language queries to MongoDB find queries.

COLLECTION SCHEMA:
The 'students' collection contains documents with these fields:
- name (string): Student's full name
- roll_no (number): Unique student roll number  
- email (string): Student's email address
- phone_no (number): Contact phone number
- address (string): Student's address
- dob (date): Date of birth in YYYY-MM-DD format
- class (string): Student's class/grade
- status (string): Student status (active, inactive, graduated, etc.)

INSTRUCTIONS:
1. Return ONLY valid JSON format with the query in a 'query' field
2. Always include at least one filter condition using existing fields
3. Use appropriate MongoDB operators for different query types
4. Handle partial matches, ranges, and multiple conditions intelligently

QUERY EXAMPLES:

## Name-based Queries
Input: "Find Neha Bhatt"
Output: { "query": { "name": "Neha Bhatt" } }

Input: "Show me students with name containing Kumar"
Output: { "query": { "name": { "$regex": "Kumar", "$options": "i" } } }

Input: "Find all students whose name starts with A"
Output: { "query": { "name": { "$regex": "^A", "$options": "i" } } }

## Roll Number Queries  
Input: "Show student with roll number 6250"
Output: { "query": { "roll_no": 6250 } }

Input: "Find students with roll numbers between 1000 and 2000"
Output: { "query": { "roll_no": { "$gte": 1000, "$lte": 2000 } } }

Input: "Students with roll number greater than 5000"
Output: { "query": { "roll_no": { "$gt": 5000 } } }

## Email Queries
Input: "Find student with email neha.bhatt8b@example.com"
Output: { "query": { "email": "neha.bhatt8b@example.com" } }

Input: "Show students with gmail accounts"
Output: { "query": { "email": { "$regex": "@gmail.com$", "$options": "i" } } }

Input: "Find students whose email contains 'admin'"
Output: { "query": { "email": { "$regex": "admin", "$options": "i" } } }

## Class-based Queries
Input: "Show all students in class 8B"
Output: { "query": { "class": "8B" } }

Input: "Find students in classes 10A or 10B"
Output: { "query": { "class": { "$in": ["10A", "10B"] } } }

Input: "Show all grade 12 students"
Output: { "query": { "class": { "$regex": "^12", "$options": "i" } } }

## Location/Address Queries
Input: "Find students from Mumbai"
Output: { "query": { "address": { "$regex": "Mumbai", "$options": "i" } } }

Input: "Show students from Maharashtra state"
Output: { "query": { "address": { "$regex": "Maharashtra", "$options": "i" } } }

Input: "Students living in Dehradun"
Output: { "query": { "address": { "$regex": "Dehradun", "$options": "i" } } }

## Phone Number Queries
Input: "Find student with phone 9380005468"
Output: { "query": { "phone_no": 9380005468 } }

Input: "Show students with phone numbers starting with 93"
Output: { "query": { "phone_no": { "$regex": "^93" } } }

## Date of Birth Queries
Input: "Students born in 2010"
Output: { "query": { "dob": { "$gte": "2010-01-01", "$lt": "2011-01-01" } } }

Input: "Find students born after 2005"
Output: { "query": { "dob": { "$gt": "2005-12-31" } } }

Input: "Students born on July 12, 2010"
Output: { "query": { "dob": "2010-07-12" } }

## Status Queries
Input: "Show all active students"
Output: { "query": { "status": "active" } }

Input: "Find inactive or graduated students"
Output: { "query": { "status": { "$in": ["inactive", "graduated"] } } }

## Multiple Condition Queries
Input: "Find active students in class 8B"
Output: { "query": { "status": "active", "class": "8B" } }

Input: "Show students named Kumar from Mumbai"
Output: { "query": { "name": { "$regex": "Kumar", "$options": "i" }, "address": { "$regex": "Mumbai", "$options": "i" } } }

Input: "Active students with roll numbers above 6000"
Output: { "query": { "status": "active", "roll_no": { "$gt": 6000 } } }

## Complex Range Queries
Input: "Students aged between 15 and 18"
Output: { "query": { "dob": { "$gte": "2006-01-01", "$lte": "2009-12-31" } } }

Input: "Find students in classes 9 to 12"
Output: { "query": { "class": { "$regex": "^(9|10|11|12)", "$options": "i" } } }

## General/List All Queries
Input: "Show all students"
Output: { "query": {} }

Input: "List everyone"
Output: { "query": {} }

Input: "Display student information"
Output: { "query": {} }

IMPORTANT NOTES:
- Use case-insensitive regex for text searches with "$options": "i"
- For partial name matches, use "$regex" with appropriate patterns
- Convert date ranges appropriately for age-based queries
- Handle numeric comparisons with proper operators ($gt, $gte, $lt, $lte)
- Use "$in" operator for multiple value matching
- Always return valid MongoDB query syntax

Input: {user_input}
Output:`;

// Utility function to clean JSON response
const cleanJsonResponse = (response) => {
    try {
        const cleaned = response.trim().replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(cleaned);
    } catch (error) {
        throw new Error(`Invalid JSON response from AI: ${error.message}`);
    }
};

// Controller function - following your existing pattern
export const handleChatbotQuery = async (req, res) => {
    console.log("Chatbot query hit");
    
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: "Missing 'query' in request body" });
        }

        // Generate AI response
        const prompt = PROMPT_TEMPLATE.replace('{user_input}', query);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("AI Response:", text);

        // Parse the AI response
        const aiResult = cleanJsonResponse(text);
        const mongoQuery = aiResult.query || {};

        if (!mongoQuery || Object.keys(mongoQuery).length === 0) {
            return res.status(400).json({ message: "Empty or invalid query generated" });
        }

        console.log("MongoDB Query:", mongoQuery);

        // Execute MongoDB query
        const students = await Student.find(mongoQuery);

        console.log("students data received from backend",students)

        if (students.length === 0) {
            return res.status(200).json({ 
                message: "No students found matching the query",
                results: []
            });
        }

        return res.status(200).json({
            message: "Query executed successfully",
            results: students
        });

    } catch (error) {
        console.error("Chatbot query error:", error);
        return res.status(500).json({ 
            message: `Error processing chatbot query: ${error.message}` 
        });
    }
};