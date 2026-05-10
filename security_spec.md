# EduPulse Security Specification

## Data Invariants
1. **Student Isolation**: A student can only view assignments, grades, and announcements for their specific class and section.
2. **Teacher Authority**: A teacher can only input grades and assignments for the class/section they are assigned to.
3. **Admin Oversight**: Admins have full read/write access to all collections for school management.
4. **Immutable Identity**: Users cannot change their own `role`, `classId`, or `sectionId` after creation (only Admins can).
5. **Private Messaging**: Messages are only accessible by the specified `senderId` or `receiverId`.

## The Dirty Dozen Payloads (Target: DENY)

1. **Identity Spoofing**: Student trying to create a user profile with `role: "admin"`.
2. **Cross-Class Grade Peek**: Student trying to 'get' a grade document belonging to a student in another class.
3. **Unauthorized Grade Entry**: Student trying to 'create' a grade document for themselves.
4. **Shadow Assignment Update**: Teacher trying to update an assignment's `teacherId` to another teacher's ID.
5. **PII Leak**: Unauthorized user trying to 'list' the `/users` collection to scrape emails.
6. **Orphaned Submission**: Creating a submission for a non-existent assignment.
7. **Message Sniffing**: User trying to 'list' `/messages` where they are neither sender nor receiver.
8. **Announcement Vandalism**: Student trying to 'delete' a school-wide announcement.
9. **PTM Hijack**: Parent/Student trying to change the `dateTime` of a PTM meeting without teacher approval.
10. **Class Structure Tampering**: Teacher trying to 'delete' a Section document.
11. **Resource Exhaustion**: Sending a 1MB string as a message `content`.
12. **Future Spoofing**: Creating an assignment with a `createdAt` date in the future.

## Test Runner Logic
The `firestore.rules` will be validated against these payloads using `firestore.rules.test.ts`. 
Specific focuses:
- `request.auth.uid` must match `resource.data.userId` for private data.
- `get()` helper to check user role from `/users/$(request.auth.uid)`.
- `affectedKeys().hasOnly()` for tiered updates.
