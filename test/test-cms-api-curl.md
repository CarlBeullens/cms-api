# ==================================================
# Quick curl Commands
# ==================================================

# 1. Login and save token to variable
export TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carl@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# View token
echo $TOKEN

# 2. List files with token
curl -X GET http://localhost:3000/users/612394ff-8bb0-4879-b3fa-590702b9eea4/files \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# 3. Upload file with token
curl -X POST http://localhost:3000/users/612394ff-8bb0-4879-b3fa-590702b9eea4/files/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$HOME/Desktop/Carl Beullens - Backend Developer.pdf" \
  | jq '.'

# 4. Get specific file (replace FILE_ID)
curl -X GET http://localhost:3000/users/5fbe90c4-fb91-481c-bf3f-68bb59297a37/files/FILE_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# 5. Get download URL (replace FILE_ID)
curl -X GET http://localhost:3000/users/5fbe90c4-fb91-481c-bf3f-68bb59297a37/files/FILE_ID/download-url \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# 6. Delete file (replace FILE_ID)
curl -X DELETE http://localhost:3000/users/5fbe90c4-fb91-481c-bf3f-68bb59297a37/files/FILE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"

# 7. Test without token (should fail with 401)
curl -X GET http://localhost:3000/users/5fbe90c4-fb91-481c-bf3f-68bb59297a37/files \
  | jq '.'

# 8. Test with invalid token (should fail with 401)
curl -X GET http://localhost:3000/users/5fbe90c4-fb91-481c-bf3f-68bb59297a37/files \
  -H "Authorization: Bearer invalid.token.here" \
  | jq '.'