# Refactor AcademicController to Fix Static Property Access

## Tasks
- [x] Update the `index` method in `AcademicController.php` to use `Auth::id()` instead of `$user->id` for database queries to avoid unnecessary user instance loading and ensure consistency with other methods.
- [x] Remove the unused `$user = Auth::user();` line in the `index` method.
- [x] Test the refactored code to ensure it works correctly without errors.

## Notes
- This refactoring addresses the "Undefined property" errors by ensuring all property access is instance-based and using the authenticated user's ID directly.
- The change improves performance by not loading the full user model unnecessarily.
