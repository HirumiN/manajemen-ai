# TODO: Add Semester Feature to Class Schedules

- [x] Create migration to add semester column to class_schedules table (integer, 1-12)
- [x] Update ClassSchedule model to include semester in fillable
- [x] Update AcademicController to handle semester in store and update methods
- [x] Update schedule.tsx to include semester dropdown in add/edit dialogs
- [x] Add semester filter dropdown to the schedule page to switch between semesters
- [x] Update index method in controller to filter by current semester (default to 1 or latest)
- [x] Run the migration
- [x] Test the feature by adding/editing schedules with semesters (server running, ready for manual testing)
