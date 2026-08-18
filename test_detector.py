from detector import detect_scam


message = "Urgent! Your account is blocked. Click here to verify: https://example.com"


result = detect_scam(message)


print("Result:", result["result"])

print("Risk Score:", result["risk_score"], "%")

print("Category:", result["category"])

print("Detected Words:", result["detected_words"])

print("Reasons:")

for reason in result["reasons"]:
    print("-", reason)

print("Links Detected:")

for link in result["links"]:
    print("-", link)