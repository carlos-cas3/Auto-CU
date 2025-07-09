// scripts/testInsert.js
const { saveAnalyzeOutput } = require("../services/test_generation.service");

const storyId = "bdea9e8d-fca4-44a8-bd85-999df88e0e80";

const raw = {
    test_cases: [
        {
            cluster: 5,
            cu: "3. [Area: E-commerce] [Role: Customer] [Action: browse catalog of instruments] [Purpose: to choose suitable instrument]",
            rf: "3. [Module: Catalog] [Function: display catalog] [Trigger: user request] [Behavior: system shall show available instruments]",
            similarity: 0.699994055563614,
            test_case:
                ' - Title: E-commerce - Display Catalog of Instruments\n\n- Objective: To verify that the system displays the available catalog of instruments when a user requests to browse the catalog.\n\n- Preconditions:\n  1. User is logged in as a customer.\n  2. User has navigated to the e-commerce platform.\n  3. The system is up and running without any errors or technical issues.\n\n- Test Steps:\n   1. Log in to the e-commerce platform as a customer.\n   2. Navigate to the instruments section of the catalog.\n   3. Verify that the system displays the title "Instruments" on the page.\n   4. Check if all available instruments are listed under appropriate categories (e.g., stringed, wind, percussion, etc.).\n   5. Click on each category and verify that only the relevant instruments are displayed.\n   6. Verify that each instrument listing includes essential information such as name, image, price, and a brief description.\n   7. Check if the system allows sorting and filtering of instruments based on various parameters like price range, brand, customer ratings, etc.\n   8. Verify that the system provides options to add instruments to the cart or wishlist.\n\n- Expected Result: The system shall display the available catalog of instruments when a user requests to browse the catalog. The displayed catalog should be organized under appropriate categories, and each instrument listing should include essential information. Additionally, the system should allow sorting and filtering of instruments based on various parameters and provide options to add instruments to the cart or wishlist.',
        },
        {
            cluster: 2,
            cu: "31. [Area: Shipping] [Role: Shipping Manager] [Action: see pending orders] [Purpose: to prepare and dispatch products]",
            rf: "28. [Module: Shipping Manager] [Function: update shipping status] [Trigger: order progress] [Behavior: system shall reflect changes in order status]",
            similarity: 0.5367239137639126,
            test_case:
                ' - Title: Verify that the Shipping Manager can see pending orders and the system reflects updated shipping status when order progress is changed.\n- Objective: To ensure that the Shipping Manager can view pending orders correctly and observe changes in the shipping status as a result of updating the order progress.\n- Preconditions:\n  1. A user is logged in with the role of Shipping Manager.\n  2. There are one or more orders in the system with a pending status.\n  3. The user has access to the Shipping Manager dashboard.\n- Test Steps:\n   1. Log in to the system as a Shipping Manager.\n   2. Navigate to the Shipping Manager dashboard.\n   3. Verify that the list of orders displays, and all pending orders are visible.\n   4. Select one of the pending orders from the list.\n   5. Update the order progress (e.g., change it from "Pending" to "In Transit").\n   6. Save the changes made to the order.\n   7. Refresh the Shipping Manager dashboard page.\n- Expected Result: The selected order\'s status should be updated to "In Transit," and the new status should be reflected on the Shipping Manager dashboard. Additionally, any other instances of this order in the system (e.g., Order Details page) should also show the updated shipping status.',
        },
        {
            cluster: 7,
            cu: "13. [Area: E-commerce] [Role: Customer] [Action: receive email confirmation after purchasing] [Purpose: to have proof of purchase]",
            rf: "33. [Module: Payment System] [Function: generate digital receipts] [Trigger: successful payment] [Behavior: system shall record transactions]",
            similarity: 0.6233858154301016,
            test_case:
                " Title: Receipt Confirmation Email After Purchase (Customer Role, E-commerce Area)\n\nObjective: To verify that a customer receives an email confirmation after a successful payment.\n\nPreconditions:\n1. A registered user account is available.\n2. The user has added items to the shopping cart and proceeded to checkout.\n3. The user has entered valid payment information and completed the transaction successfully.\n4. The user's email address is correctly associated with their account.\n5. The system is operational and functioning as expected.\n\nTest Steps:\n1. Log in to the e-commerce platform using the registered customer account.\n2. Navigate to the shopping cart and ensure that the desired items are present.\n3. Proceed to checkout by clicking on the \"Checkout\" button.\n4. Enter valid payment information and complete the transaction successfully.\n5. Wait for a short period (e.g., 5 minutes) after the successful transaction.\n6. Check the email associated with the customer account for any new messages.\n\nExpected Result:\n1. The user should be redirected to a confirmation page upon completing the transaction.\n2. An email containing a digital receipt of the purchase should have been sent to the customer's email address within the specified timeframe.\n3. The email should contain essential details such as the date, items purchased, total cost, and any relevant order numbers or reference codes for future reference.\n4. The user should be able to access and download the digital receipt from the email.\n5. The system should correctly record the transaction in the payment system module.",
        },
        {
            cluster: 7,
            cu: "37. [Area: Payment System] [Role: Payment System] [Action: generate digital receipts] [Purpose: to record transactions]",
            rf: "33. [Module: Payment System] [Function: generate digital receipts] [Trigger: successful payment] [Behavior: system shall record transactions]",
            similarity: 0.7969974240562039,
            test_case:
                " - Title: Test Case for Generating Digital Receipts in the Payment System\n- Objective: To verify that the Payment System correctly generates digital receipts upon successful payment.\n- Preconditions:\n  1. The system is up and running.\n  2. A user has logged into the system with valid credentials.\n  3. The user has a valid payment method associated with their account.\n  4. The user initiates a payment transaction successfully.\n\n- Test Steps:\n   1. Log into the Payment System using valid credentials.\n   2. Navigate to the 'Make Payment' section.\n   3. Select a valid payment method.\n   4. Enter the required payment details (amount, recipient, etc.).\n   5. Confirm the payment details and initiate the transaction.\n   6. Wait for the system to process the payment successfully.\n   7. Check the 'Transaction History' section for the newly initiated payment.\n   8. Click on the specific transaction in the history list.\n   9. Verify that a digital receipt is generated and displayed with all relevant details (transaction ID, date, time, amount, recipient, etc.).\n\n- Expected Result: The system should generate a digital receipt upon successful payment, which can be viewed and downloaded from the 'Transaction History' section. The digital receipt should contain all relevant transaction details.",
        },
    ],
};
(async () => {
    // Extraer CU únicos
    const cuSet = new Set();
    for (const tc of raw.test_cases) cuSet.add(tc.cu);
    const valid_cu = [...cuSet].map((original) => ({ original }));

    // Extraer RF únicos
    const rfSet = new Set();
    for (const tc of raw.test_cases) rfSet.add(tc.rf);
    const valid_rf = [...rfSet].map((original) => ({ original }));

    const analyzeResult = {
        valid_cu,
        valid_rf,
        test_cases: raw.test_cases,
    };

    try {
        const result = await saveAnalyzeOutput(storyId, analyzeResult);
        console.log("✅ Inserción exitosa:\n", result);
    } catch (err) {
        console.error("❌ Error al insertar:\n", err.message);
    }
})();
