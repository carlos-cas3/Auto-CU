def generate_test_case_prompt(cu, rf, similarity):
    return f"""
You are a professional QA engineer.

Generate a detailed test case in English based on the following information.

Use the following structure:
- Title 
- Objective
- Preconditions
- Test Steps
- Expected Result

🧾 Use Case (CU):
{cu['original']}

🛠️ Functional Requirement (RF):
{rf['original']}

Similarity Score: {similarity:.3f}

Only respond with the test case.
""".strip()