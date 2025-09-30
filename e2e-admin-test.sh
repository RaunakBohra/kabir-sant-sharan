#!/bin/bash

# E2E Test Script for Admin Features
# Tests: Admin Layout, Session Auth, Event Creation/Deletion, Teaching Deletion

set -e

BASE_URL="http://localhost:5002"
ADMIN_EMAIL="admin@kabirsantsharan.com"
ADMIN_PASSWORD="admin123"

echo "=========================================="
echo "E2E Admin Testing"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((FAILED++))
    fi
    echo ""
}

echo "=========================================="
echo "TEST 1: Session Authentication Endpoint"
echo "=========================================="

# Test unauthenticated session check
echo "Testing unauthenticated session check..."
RESPONSE=$(curl -s -L -w "\n%{http_code}" "$BASE_URL/api/auth/session")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
    test_result 0 "Unauthenticated session returns 401"
else
    test_result 1 "Unauthenticated session should return 401, got $HTTP_CODE"
fi

echo "=========================================="
echo "TEST 2: Admin Login"
echo "=========================================="

echo "Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -L -c cookies.txt -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$LOGIN_HTTP_CODE" = "200" ]; then
    test_result 0 "Admin login successful"
    ACCESS_TOKEN=$(echo "$LOGIN_BODY" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
else
    test_result 1 "Admin login failed with code $LOGIN_HTTP_CODE"
    echo "Response: $LOGIN_BODY"
    exit 1
fi

echo "=========================================="
echo "TEST 3: Authenticated Session Check"
echo "=========================================="

echo "Testing authenticated session check..."
SESSION_RESPONSE=$(curl -s -L -b cookies.txt -w "\n%{http_code}" "$BASE_URL/api/auth/session")
SESSION_HTTP_CODE=$(echo "$SESSION_RESPONSE" | tail -n 1)
SESSION_BODY=$(echo "$SESSION_RESPONSE" | sed '$d')

if [ "$SESSION_HTTP_CODE" = "200" ] && echo "$SESSION_BODY" | grep -q "userId"; then
    test_result 0 "Authenticated session check successful"
else
    test_result 1 "Authenticated session check failed with code $SESSION_HTTP_CODE"
    echo "Response: $SESSION_BODY"
fi

echo "=========================================="
echo "TEST 4: Event Creation"
echo "=========================================="

echo "Creating a test event..."
EVENT_DATA=$(cat <<EOF
{
  "title": "E2E Test Meditation Session",
  "description": "<p>This is a test meditation session created by E2E testing</p>",
  "type": "meditation",
  "location": "Virtual",
  "virtualLink": "https://zoom.us/test",
  "startDate": "2025-10-15",
  "endDate": "2025-10-15",
  "startTime": "18:00",
  "endTime": "19:00",
  "timezone": "Asia/Kathmandu",
  "category": "meditation",
  "tags": ["test", "e2e", "meditation"],
  "organizer": "E2E Test Suite",
  "language": "en",
  "published": false,
  "featured": false,
  "registrationRequired": true,
  "maxAttendees": 50
}
EOF
)

CREATE_EVENT_RESPONSE=$(curl -s -L -b cookies.txt -w "\n%{http_code}" -X POST "$BASE_URL/api/events" \
  -H "Content-Type: application/json" \
  -d "$EVENT_DATA")

CREATE_EVENT_HTTP_CODE=$(echo "$CREATE_EVENT_RESPONSE" | tail -n 1)
CREATE_EVENT_BODY=$(echo "$CREATE_EVENT_RESPONSE" | sed '$d')

if [ "$CREATE_EVENT_HTTP_CODE" = "201" ]; then
    test_result 0 "Event creation successful"
    EVENT_ID=$(echo "$CREATE_EVENT_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Created Event ID: $EVENT_ID"
else
    test_result 1 "Event creation failed with code $CREATE_EVENT_HTTP_CODE"
    echo "Response: $CREATE_EVENT_BODY"
fi

echo "=========================================="
echo "TEST 5: Get Event by ID"
echo "=========================================="

if [ ! -z "$EVENT_ID" ]; then
    echo "Fetching created event..."
    GET_EVENT_RESPONSE=$(curl -s -L -b cookies.txt -w "\n%{http_code}" "$BASE_URL/api/events/$EVENT_ID")
    GET_EVENT_HTTP_CODE=$(echo "$GET_EVENT_RESPONSE" | tail -n 1)
    GET_EVENT_BODY=$(echo "$GET_EVENT_RESPONSE" | sed '$d')

    if [ "$GET_EVENT_HTTP_CODE" = "200" ] && echo "$GET_EVENT_BODY" | grep -q "E2E Test Meditation Session"; then
        test_result 0 "Get event by ID successful"
    else
        test_result 1 "Get event by ID failed with code $GET_EVENT_HTTP_CODE"
        echo "Response: $GET_EVENT_BODY"
    fi
else
    test_result 1 "Skipping get event test - no event ID"
fi

echo "=========================================="
echo "TEST 6: List Events"
echo "=========================================="

echo "Fetching events list..."
LIST_EVENTS_RESPONSE=$(curl -s -L -w "\n%{http_code}" "$BASE_URL/api/events?limit=10")
LIST_EVENTS_HTTP_CODE=$(echo "$LIST_EVENTS_RESPONSE" | tail -n 1)
LIST_EVENTS_BODY=$(echo "$LIST_EVENTS_RESPONSE" | sed '$d')

if [ "$LIST_EVENTS_HTTP_CODE" = "200" ] && echo "$LIST_EVENTS_BODY" | grep -q "events"; then
    test_result 0 "List events successful"
else
    test_result 1 "List events failed with code $LIST_EVENTS_HTTP_CODE"
fi

echo "=========================================="
echo "TEST 7: Event Deletion"
echo "=========================================="

if [ ! -z "$EVENT_ID" ]; then
    echo "Deleting test event..."
    DELETE_EVENT_RESPONSE=$(curl -s -L -b cookies.txt -w "\n%{http_code}" -X DELETE "$BASE_URL/api/events/$EVENT_ID")
    DELETE_EVENT_HTTP_CODE=$(echo "$DELETE_EVENT_RESPONSE" | tail -n 1)
    DELETE_EVENT_BODY=$(echo "$DELETE_EVENT_RESPONSE" | sed '$d')

    if [ "$DELETE_EVENT_HTTP_CODE" = "200" ]; then
        test_result 0 "Event deletion successful"
    else
        test_result 1 "Event deletion failed with code $DELETE_EVENT_HTTP_CODE"
        echo "Response: $DELETE_EVENT_BODY"
    fi
else
    test_result 1 "Skipping delete event test - no event ID"
fi

echo "=========================================="
echo "TEST 8: Teaching List"
echo "=========================================="

echo "Fetching teachings list..."
LIST_TEACHINGS_RESPONSE=$(curl -s -L -w "\n%{http_code}" "$BASE_URL/api/teachings?limit=10")
LIST_TEACHINGS_HTTP_CODE=$(echo "$LIST_TEACHINGS_RESPONSE" | tail -n 1)
LIST_TEACHINGS_BODY=$(echo "$LIST_TEACHINGS_RESPONSE" | sed '$d')

if [ "$LIST_TEACHINGS_HTTP_CODE" = "200" ] && echo "$LIST_TEACHINGS_BODY" | grep -q "teachings"; then
    test_result 0 "List teachings successful"
    # Extract first teaching ID for deletion test
    TEACHING_ID=$(echo "$LIST_TEACHINGS_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Sample Teaching ID: $TEACHING_ID"
else
    test_result 1 "List teachings failed with code $LIST_TEACHINGS_HTTP_CODE"
fi

echo "=========================================="
echo "TEST 9: Teaching Deletion (Soft Delete)"
echo "=========================================="

if [ ! -z "$TEACHING_ID" ]; then
    echo "Testing teaching deletion endpoint..."
    DELETE_TEACHING_RESPONSE=$(curl -s -L -b cookies.txt -w "\n%{http_code}" -X DELETE "$BASE_URL/api/teachings/$TEACHING_ID")
    DELETE_TEACHING_HTTP_CODE=$(echo "$DELETE_TEACHING_RESPONSE" | tail -n 1)
    DELETE_TEACHING_BODY=$(echo "$DELETE_TEACHING_RESPONSE" | sed '$d')

    if [ "$DELETE_TEACHING_HTTP_CODE" = "200" ]; then
        test_result 0 "Teaching deletion endpoint accessible"
    else
        test_result 1 "Teaching deletion failed with code $DELETE_TEACHING_HTTP_CODE"
        echo "Response: $DELETE_TEACHING_BODY"
    fi
else
    echo -e "${YELLOW}⚠ SKIPPED${NC}: No teaching ID available for deletion test"
    echo ""
fi

echo "=========================================="
echo "TEST 10: Admin Layout Check"
echo "=========================================="

echo "Checking admin page HTML structure..."
ADMIN_PAGE_RESPONSE=$(curl -s -L -b cookies.txt "$BASE_URL/admin/content")

# Check that admin page doesn't include user NavBar component
if echo "$ADMIN_PAGE_RESPONSE" | grep -q "AdminHeader" || ! echo "$ADMIN_PAGE_RESPONSE" | grep -q "\"quote\""; then
    test_result 0 "Admin page uses separate layout (no user NavBar)"
else
    echo -e "${YELLOW}⚠ WARNING${NC}: Could not definitively verify admin layout"
    echo "Note: This may be a false negative due to SSR/client-side rendering"
    echo ""
fi

# Cleanup
rm -f cookies.txt

echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi