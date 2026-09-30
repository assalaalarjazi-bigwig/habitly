import { Language } from '../types';

export const translations = {
  ar: {
    // App Branding
    appName: 'Habitly',
    appTagline: 'تتبع عاداتك ببساطة وهدوء',

    // Navigation
    navHome: 'الرئيسية',
    navCalendar: 'التقويم',
    navStatistics: 'الإحصائيات',
    navAchievements: 'الإنجازات',
    navSettings: 'الإعدادات',

    // Home Screen
    todayProgress: 'إنجاز اليوم',
    todayHabits: 'عادات اليوم',
    weeklyGoalProgress: 'الهدف الأسبوعي',
    recentHighlight: 'آخر إنجاز مفتوح',
    streakDays: 'أيام متتالية',
    dayStreak: 'سلسلة {days} أيام',
    completedHabit: 'مكتملة',
    markComplete: 'إكمال',
    undoComplete: 'تراجع',
    allDoneToday: 'رائع! أكملت جميع عاداتك اليوم 🎉',
    keepGoing: 'أنت في المسار الصحيح، استمر!',

    // Empty States
    noHabitsTitle: 'ابدأ عادتك الأولى 🌱',
    noHabitsSubtitle: 'خطوات بسيطة يومياً تصنع فارقاً حقيقياً في حياتك.',
    addHabitAction: 'إضافة عادة جديدة',
    noAchievementsTitle: 'إنجازاتك ستظهر هنا ✨',
    noAchievementsSubtitle: 'استمر في الالتزام بعاداتك لفتح أوسمة التميز!',
    noStatsTitle: 'لا توجد إحصائيات كافية بعد',
    noStatsSubtitle: 'سجل إنجازاتك لعدة أيام لعرض الرسوم والتحليلات البيانية.',
    noHabitsOnDay: 'لا توجد عادات مسجلة لهذا اليوم.',

    // Habit Modal (Create / Edit)
    createHabitTitle: 'إضافة عادة جديدة',
    editHabitTitle: 'تعديل العادة',
    habitNameLabel: 'اسم العادة',
    habitNamePlaceholder: 'مثال: قراءة 15 دقيقة، المشي...',
    habitIconLabel: 'الأيقونة',
    habitColorLabel: 'لون التمييز',
    weeklyGoalLabel: 'الهدف الأسبوعي (أيام بالأسبوع)',
    daysPerWeek: '{days} أيام / أسبوع',
    reminderSectionTitle: 'التذكير اليومي',
    reminderEnableLabel: 'تفعيل التذكير المحلي',
    reminderTimeLabel: 'وقت التذكير',
    saveHabitBtn: 'حفظ العادة',
    updateHabitBtn: 'تحديث العادة',
    deleteHabitBtn: 'حذف العادة',
    cancelBtn: 'إلغاء',
    confirmDeleteTitle: 'حذف العادة؟',
    confirmDeleteMsg: 'هل أنت متأكد من رغبتك بحذف هذه العادة وجميع سجلات إنجازها؟ لا يمكن التراجع عن هذا الإجراء.',

    // Calendar Screen
    calendarTitle: 'سجل العادات الشهري',
    selectedDaySummary: 'تفاصيل اليوم',
    habitsCompletedOnDay: 'العادات المكتملة',
    habitsIncompleteOnDay: 'عادات لم تكتمل',
    dailyCompletionRate: 'نسبة الإنجاز',
    prevMonth: 'الشهر السابق',
    nextMonth: 'الشهر القادم',
    todayBtn: 'اليوم',

    // Statistics Screen
    statsTitle: 'إحصائيات الإنجاز',
    statOverallRate: 'نسبة الالتزام العامة',
    statTotalCompletions: 'إجمالي مرات الإنجاز',
    statCurrentStreak: 'أطول سلسلة حالية',
    statBestStreak: 'أفضل سلسلة تاريخية',
    statMostConsistent: 'العادة الأكثر التزاماً',
    statActiveHabits: 'العادات النشطة',
    weeklyPerformance: 'أداء الأسبوع الحالي',
    daysCount: '{count} يوم',
    completionsCount: '{count} إنجاز',
    noConsistentHabitYet: 'لم يتحدد بعد',

    // Achievements Screen
    achievementsTitle: 'سجل الأوسمة والإنجازات',
    achievementsUnlockedCount: 'تم فتح {unlocked} من أصل {total}',
    lockedBadge: 'مقفل',
    unlockedBadge: 'تم الإنجاز',
    achFilterAll: 'الكل',
    achFilterUnlocked: 'المكتملة',
    achFilterLocked: 'قيد الإنجاز',
    allAchievementsUnlockedMsg: 'مذهل! لقد فتحت جميع الأوسمة! 🌟',
    keepGoingAchievementsMsg: 'واصل الالتزام اليومي لفتح المزيد من الأوسمة',

    // Achievements Definitions
    ach_first_step_title: 'الخطوة الأولى',
    ach_first_step_desc: 'أكمل عادتك الأولى بنجاح.',
    ach_streak_3_title: 'سلسلة 3 أيام',
    ach_streak_3_desc: 'حافظ على إنجاز العادة 3 أيام متتالية.',
    ach_streak_7_title: 'سلسلة أسبوع كامل',
    ach_streak_7_desc: 'حافظ على سلسلة إنجاز لمدة 7 أيام متتالية.',
    ach_streak_14_title: 'شعلة الالتزام (14 يوم)',
    ach_streak_14_desc: 'حافظ على سلسلة إنجاز لمدة 14 يوماً.',
    ach_perfect_day_title: 'يوم مثالي',
    ach_perfect_day_desc: 'أكمل جميع عاداتك النشطة في يوم واحد.',
    ach_weekly_goal_title: 'بطل الأسبوع',
    ach_weekly_goal_desc: 'حقق الهدف الأسبوعي لإحدى عاداتك بالكامل.',
    ach_completions_30_title: '30 إنجازاً',
    ach_completions_30_desc: 'أنجز عاداتك 30 مرة إجمالاً.',
    ach_habit_master_title: 'صانع العادات',
    ach_habit_master_desc: 'أنشئ 5 عادات إيجابية في سجلك.',

    // Settings Screen
    settingsTitle: 'الإعدادات والتفضيلات',
    saveSettingsBtn: 'حفظ الإعدادات',
    settingsSavedToast: 'تم حفظ كافة التفضيلات بنجاح! ✨',
    appearanceHeader: 'المظهر',
    themeLight: 'فاتح',
    themeDark: 'داكن',
    themeSystem: 'تلقائي (حسب النظام)',
    colorThemeHeader: 'سمة الألوان',
    themeDefault: 'الزمردي (افتراضي)',
    themeGreen: 'الميرمية (أخضر هادئ)',
    themeBlue: 'المحيط (أزرق)',
    themePurple: 'اللافندر (بنفسجي)',
    themePink: 'الورد (وردي ناعم)',
    themeOrange: 'الغروب (برتقالي دافئ)',
    languageHeader: 'اللغة / Language',
    langArabic: 'العربية (افتراضي - RTL)',
    langEnglish: 'English (LTR)',
    notificationsHeader: 'التنبيهات والأصوات',
    enableNotifications: 'التذكيرات المحلية',
    enableSounds: 'المؤثرات الصوتية التفاعلية',
    soundEffectsDesc: 'أصوات ناعمة وهادئة للتفاعل',
    testNotificationBtn: 'تجربة إشعار تذكيري',
    testNotificationSent: 'تم إرسال إشعار تجريبي!',
    notifications_denied_help: 'التنبيهات مقيدة في متصفحك. ستظهر التذكيرات داخل التطبيق بصورة طبيعية.',
    notifications_unsupported: 'التطبيق يستخدم التنبيهات الداخلية لتذكيرك بعاداتك.',

    // Data Management
    dataHeader: 'إدارة البيانات المحلية',
    loadSampleDataBtn: 'تحميل عادات تجريبية',
    sampleDataLoaded: 'تم تحميل العادات النموذجية بنجاح!',
    resetAllDataBtn: 'مسح جميع البيانات والبدء من جديد',
    confirmResetTitle: 'تصفير كافة البيانات؟',
    confirmResetMsg: 'سيتم مسح جميع العادات المسجلة وسجلات الإنجاز والتواريخ نهائياً. هل أنت متأكد؟',
    dataResetSuccess: 'تم تصفير البيانات بنجاح.',

    // Device Frame
    phoneFrame: 'شاشة الهاتف',
    fullView: 'العرض الكامل',
    appDeviceHeader: 'Habitly • متتبع العادات اليومي',

    // About
    aboutHeader: 'عن التطبيق',
    versionLabel: 'الإصدار',
    offlineStatusLabel: 'الوضع',
    offlineStatusValue: 'يعمل محلياً دون اتصال 100%',

    // Onboarding
    onboardingTitle: 'ابنِ عادات أفضل، يوماً بعد يوم',
    onboardingSubtitle: 'تطبيق هادئ وخفيف يساعدك على بناء نمط حياة صحي ومتزن بخصوصية تامة وبدون إنترنت.',
    onboardingNamePrompt: 'ما هو اسمك؟ (اختياري)',
    onboardingNamePlaceholder: 'اسمك المستعار',
    onboardingLoadSampleOption: 'إضافة بعض العادات المقترحة كبداية',
    onboardingStartBtn: 'ابدأ رحلتك الآن',

    // Feedback
    habitCompletedToast: 'أحسنت! استمر في هذا الإنجاز ✨',
    achievementUnlockedToast: 'وسام جديد مفتوح: {title}! 🏆',
    undoToast: 'تم إلغاء الإنجاز',
  },

  en: {
    // App Branding
    appName: 'Habitly',
    appTagline: 'Build better habits, one day at a time',

    // Navigation
    navHome: 'Home',
    navCalendar: 'Calendar',
    navStatistics: 'Statistics',
    navAchievements: 'Achievements',
    navSettings: 'Settings',

    // Home Screen
    todayProgress: "Today's Progress",
    todayHabits: "Today's Habits",
    weeklyGoalProgress: 'Weekly Goal',
    recentHighlight: 'Latest Achievement',
    streakDays: 'day streak',
    dayStreak: '{days} day streak',
    completedHabit: 'Completed',
    markComplete: 'Complete',
    undoComplete: 'Undo',
    allDoneToday: 'Brilliant! All habits completed for today 🎉',
    keepGoing: "You're on track, keep the momentum!",

    // Empty States
    noHabitsTitle: 'Start your first habit 🌱',
    noHabitsSubtitle: 'Small consistent steps lead to remarkable transformation.',
    addHabitAction: 'Add a Habit',
    noAchievementsTitle: 'Your achievements will appear here ✨',
    noAchievementsSubtitle: 'Stay consistent with your daily habits to unlock badges!',
    noStatsTitle: 'Not enough data yet',
    noStatsSubtitle: 'Log your habits for a few days to view charts and statistics.',
    noHabitsOnDay: 'No habits logged for this date.',

    // Habit Modal (Create / Edit)
    createHabitTitle: 'Create New Habit',
    editHabitTitle: 'Edit Habit',
    habitNameLabel: 'Habit Name',
    habitNamePlaceholder: 'e.g. Read 15 mins, Morning workout...',
    habitIconLabel: 'Icon',
    habitColorLabel: 'Accent Color',
    weeklyGoalLabel: 'Weekly Goal (days per week)',
    daysPerWeek: '{days} days / week',
    reminderSectionTitle: 'Daily Reminder',
    reminderEnableLabel: 'Enable local reminder',
    reminderTimeLabel: 'Reminder time',
    saveHabitBtn: 'Save Habit',
    updateHabitBtn: 'Update Habit',
    deleteHabitBtn: 'Delete Habit',
    cancelBtn: 'Cancel',
    confirmDeleteTitle: 'Delete Habit?',
    confirmDeleteMsg: 'Are you sure you want to delete this habit and all its completion records? This cannot be undone.',

    // Calendar Screen
    calendarTitle: 'Monthly Habit History',
    selectedDaySummary: 'Day Details',
    habitsCompletedOnDay: 'Completed Habits',
    habitsIncompleteOnDay: 'Incomplete Habits',
    dailyCompletionRate: 'Completion Rate',
    prevMonth: 'Previous Month',
    nextMonth: 'Next Month',
    todayBtn: 'Today',

    // Statistics Screen
    statsTitle: 'Habit Statistics',
    statOverallRate: 'Overall Consistency',
    statTotalCompletions: 'Total Completions',
    statCurrentStreak: 'Current Longest Streak',
    statBestStreak: 'Best Historical Streak',
    statMostConsistent: 'Most Consistent Habit',
    statActiveHabits: 'Active Habits',
    weeklyPerformance: 'This Week’s Performance',
    daysCount: '{count} days',
    completionsCount: '{count} completions',
    noConsistentHabitYet: 'Not determined yet',

    // Achievements Screen
    achievementsTitle: 'Achievements & Milestones',
    achievementsUnlockedCount: '{unlocked} of {total} Unlocked',
    lockedBadge: 'Locked',
    unlockedBadge: 'Completed',
    achFilterAll: 'All',
    achFilterUnlocked: 'Unlocked',
    achFilterLocked: 'In Progress',
    allAchievementsUnlockedMsg: 'Incredible! You have unlocked all badges! 🌟',
    keepGoingAchievementsMsg: 'Keep up your daily habits to unlock more badges',

    // Achievements Definitions
    ach_first_step_title: 'First Step',
    ach_first_step_desc: 'Complete your first habit successfully.',
    ach_streak_3_title: '3-Day Streak',
    ach_streak_3_desc: 'Maintain a 3-day consecutive streak.',
    ach_streak_7_title: '7-Day Streak',
    ach_streak_7_desc: 'Maintain a 7-day consecutive streak.',
    ach_streak_14_title: '14-Day Momentum',
    ach_streak_14_desc: 'Keep your streak alive for two full weeks.',
    ach_perfect_day_title: 'Perfect Day',
    ach_perfect_day_desc: 'Complete every active habit in a single day.',
    ach_weekly_goal_title: 'Weekly Champion',
    ach_weekly_goal_desc: 'Achieve the weekly goal for any habit.',
    ach_completions_30_title: '30 Completions',
    ach_completions_30_desc: 'Complete habits 30 times total.',
    ach_habit_master_title: 'Habit Master',
    ach_habit_master_desc: 'Create 5 active positive habits.',

    // Settings Screen
    settingsTitle: 'Settings & Preferences',
    saveSettingsBtn: 'Save Settings',
    settingsSavedToast: 'All settings saved successfully! ✨',
    appearanceHeader: 'Appearance',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System Default',
    colorThemeHeader: 'Color Theme',
    themeDefault: 'Emerald (Default)',
    themeGreen: 'Sage / Green',
    themeBlue: 'Ocean / Blue',
    themePurple: 'Lavender / Purple',
    themePink: 'Rose / Pink',
    themeOrange: 'Sunset / Orange',
    languageHeader: 'Language / اللغة',
    langArabic: 'العربية (افتراضي - RTL)',
    langEnglish: 'English (LTR)',
    notificationsHeader: 'Notifications & Audio',
    enableNotifications: 'Local Reminders',
    enableSounds: 'Subtle Sound Effects',
    soundEffectsDesc: 'Gentle, satisfying interaction sounds',
    testNotificationBtn: 'Test Sample Notification',
    testNotificationSent: 'Test notification fired!',
    notifications_denied_help: 'Browser notifications restricted. In-app alerts will continue to work smoothly.',
    notifications_unsupported: 'In-app reminders are active for your habits.',

    // Data Management
    dataHeader: 'Local Data Storage',
    loadSampleDataBtn: 'Load Sample Habits',
    sampleDataLoaded: 'Sample habits loaded successfully!',
    resetAllDataBtn: 'Reset All Data',
    confirmResetTitle: 'Reset All Data?',
    confirmResetMsg: 'This will permanently remove all habits, completion history, streaks, and progress. Are you sure?',
    dataResetSuccess: 'All data has been reset.',

    // Device Frame
    phoneFrame: 'Phone Frame',
    fullView: 'Full Screen',
    appDeviceHeader: 'Habitly • Offline Habit Tracker',

    // About
    aboutHeader: 'About',
    versionLabel: 'Version',
    offlineStatusLabel: 'Offline Architecture',
    offlineStatusValue: '100% Local & Offline First',

    // Onboarding
    onboardingTitle: 'Build better habits, one day at a time',
    onboardingSubtitle: 'A calm, simple, offline-first companion to help you build lasting routines without noise.',
    onboardingNamePrompt: 'What should we call you? (optional)',
    onboardingNamePlaceholder: 'Your name or nickname',
    onboardingLoadSampleOption: 'Include starter sample habits',
    onboardingStartBtn: 'Get Started',

    // Feedback
    habitCompletedToast: 'Well done! Streak updated ✨',
    achievementUnlockedToast: 'Achievement Unlocked: {title}! 🏆',
    undoToast: 'Habit completion undone',
  },
};

export type TranslationKey = keyof typeof translations.en;
