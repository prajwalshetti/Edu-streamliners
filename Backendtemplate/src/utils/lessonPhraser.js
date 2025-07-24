
export function buildLessonPlanPrompt(details) {
    // details is req.body
    return `
  You are an expert educational content writer.  
  Given the following lesson plan details as key:value pairs:
  
  ${JSON.stringify(details, null, 2)}
  
  1. Rephrase each field that already has a value into a clear, concise, professional tone.  
  2. For any field that is blank, missing, or an empty array, invent an appropriate value consistent with the others.  
  3. Return only valid JSON (no extra commentary) with these exact top‑level keys:
     title, subject, grade, section, date, duration,
     learningObjectives (an array of strings),
     prerequisiteKnowledge,
     teachingMethods (array),
     materials (array),
     lessonStructure (object with introduction, mainContent, conclusion, assessment),
     homework,
     differentiation (object with struggling and advanced),
     reflection.
  4. Dont keep anythings empty, even if i give you empty data, there will be a key, try to fill those thigns
  5.In addition to the listed top-level keys, also include two extra top-level keys: \`resources\` and \`materials\`. Even if they are not present in the input, generate meaningful values for both based on the context of the lesson. Do not skip them.
  6. keep status: Draft only 
  `;
  }
  