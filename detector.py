import re


def detect_scam(message):

    message = message.lower()

    risk_score = 0
    detected_words = []
    reasons = []
    categories = []

    # Detect links
    links = re.findall(
        r'https?://[^\s]+|www\.[^\s]+',
        message
    )

    # --------------------------------
    # 1. PRIZE / LOTTERY SCAM
    # --------------------------------

    prize_words = [
        "prize",
        "winner",
        "won",
        "lottery",
        "reward",
        "lucky draw",
        "cash prize"
    ]

    for word in prize_words:

        if word in message:

            risk_score += 20
            detected_words.append(word)

            reasons.append(
                "Prize or lottery claim detected"
            )

            categories.append("Prize Scam")

            break

    # --------------------------------
    # 2. BANK / UPI SCAM
    # --------------------------------

    bank_words = [
        "bank account",
        "upi",
        "bank",
        "transaction",
        "account blocked",
        "account suspended"
    ]

    for word in bank_words:

        if word in message:

            risk_score += 20
            detected_words.append(word)

            reasons.append(
                "Bank or financial account activity detected"
            )

            categories.append("Banking Scam")

            break

    # --------------------------------
    # 3. OTP / PASSWORD SCAM
    # --------------------------------

    security_words = [
        "otp",
        "one time password",
        "password",
        "pin",
        "cvv",
        "verification code"
    ]

    for word in security_words:

        if word in message:

            risk_score += 25
            detected_words.append(word)

            reasons.append(
                "Sensitive security information may be requested"
            )

            categories.append("Account Security Scam")

            break

    # --------------------------------
    # 4. URGENCY SCAM
    # --------------------------------

    urgency_words = [
        "urgent",
        "immediately",
        "act now",
        "right now",
        "last chance",
        "within 24 hours",
        "do not delay"
    ]

    for word in urgency_words:

        if word in message:

            risk_score += 15
            detected_words.append(word)

            reasons.append(
                "Urgent or pressure-based language detected"
            )

            categories.append("Urgency Scam")

            break

    # --------------------------------
    # 5. PAYMENT SCAM
    # --------------------------------

    payment_words = [
        "send money",
        "transfer money",
        "pay now",
        "make payment",
        "payment required",
        "send payment",
        "pay immediately"
    ]

    for word in payment_words:

        if word in message:

            risk_score += 25
            detected_words.append(word)

            reasons.append(
                "Suspicious payment request detected"
            )

            categories.append("Payment Scam")

            break

    # --------------------------------
    # 6. REFUND SCAM
    # --------------------------------

    refund_words = [
        "refund",
        "cashback",
        "money back",
        "refund pending",
        "claim your refund"
    ]

    for word in refund_words:

        if word in message:

            risk_score += 20
            detected_words.append(word)

            reasons.append(
                "Refund or cashback claim detected"
            )

            categories.append("Refund Scam")

            break

    # --------------------------------
    # 7. IMPERSONATION SCAM
    # --------------------------------

    impersonation_words = [
        "customer care",
        "support team",
        "bank officer",
        "police officer",
        "government officer",
        "income tax department",
        "official notice"
    ]

    for word in impersonation_words:

        if word in message:

            risk_score += 20
            detected_words.append(word)

            reasons.append(
                "Possible impersonation of an official or trusted organization"
            )

            categories.append("Impersonation Scam")

            break

    # --------------------------------
    # 8. PHISHING / LINK SCAM
    # --------------------------------

    click_words = [
        "click here",
        "click the link",
        "open this link",
        "visit this link"
    ]

    for word in click_words:

        if word in message:

            risk_score += 15
            detected_words.append(word)

            reasons.append(
                "Message asks the user to interact with a link"
            )

            categories.append("Phishing Scam")

            break

    # Actual link found

    if len(links) > 0:

        risk_score += 15

        reasons.append(
            "A web link was detected in the message"
        )

        categories.append("Phishing Scam")

    # --------------------------------
    # 9. LIMIT SCORE
    # --------------------------------

    if risk_score > 100:

        risk_score = 100

    # Remove duplicate categories

    categories = list(dict.fromkeys(categories))

    # Remove duplicate detected words

    detected_words = list(
        dict.fromkeys(detected_words)
    )

    # --------------------------------
    # 10. FINAL RESULT
    # --------------------------------

    if risk_score >= 60:

        result = "Scam"

    elif risk_score >= 30:

        result = "Suspicious"

    else:

        result = "Safe"

    # --------------------------------
    # 11. CATEGORY
    # --------------------------------

    if len(categories) == 0:

        category = "No suspicious category"

    elif len(categories) == 1:

        category = categories[0]

    else:

        category = "Multiple Scam Types"

    # --------------------------------
    # 12. RETURN RESULT
    # --------------------------------

    return {

        "result": result,

        "risk_score": risk_score,

        "category": category,

        "detected_words": detected_words,

        "reasons": reasons,

        "links": links

    }