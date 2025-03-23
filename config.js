// Configuration for Crescent City RP Loading Screen
const config = {
    // Server information
    serverName: "Your Server Name",
    serverTagline: "Where your story begins",
    
    // Server connection information
    serverConnection: {
        // FiveM connection code (used for fetching player count)
        joinCode: "Your server join code",
        // Discord invite link
        discordInvite: "https://discord.gg/yourdiscord",
        // Website URL
        website: "https://yourwebsite.com"
    },
    
    // Loading screen settings
    loadingScreen: {
        // Text shown when loading completes
        completeText: "Welcome to Server Name!",
        // Minimum time to show loading screen in milliseconds (prevents flashing if loading is too fast)
        minDisplayTime: 5000
    },
    
    // Tips to display in the rotating tips panel
    tips: [
        "Press F1 to open the help menu",
        "Use /report to contact admins for assistance",
        "Join our Discord community for updates and events",
        "Remember to follow all server rules for the best experience",
        "Use T to type in chat and Y for radio communications",
        "Check out our website for more information about the server",
        "Press F2 to access your inventory",
        "Use /me to describe your actions in roleplay",
        "Press F3 to open the emote menu",
        "Respect other players and maintain roleplay at all times"
    ],
    
    // Default keybinds to display
    keybinds: [
        { key: "M", action: "Interaction Menu" },
        { key: "F4", action: "Emote Menu" },
        { key: "F3", action: "Phone" },
        { key: "F1", action: "vMenu" },
        { key: "P", action: "Map" },
        { key: "B", action: "Point" },
        { key: "F11", action: "Voice Range" },
        { key: "X", action: "Hands Up" }
    ],
    
    // Background music settings
    music: {
        // Enable or disable background music
        enabled: true,
        // URL to the music file (can be relative or absolute)
        url: "audio/background.mp3",
        // Title of the music track
        title: "Server name Theme",
        // Volume level (0.0 to 1.0)
        volume: 0.3,
        // Automatically play music when page loads (requires user interaction due to browser policies)
        autoplay: true
    },
    
    // Visual customization
    visual: {
        // Main color scheme (used for progress bar and accents)
        primaryColor: "#4a6bff",
        secondaryColor: "#6e8fff",
        // Background settings
        background: {
            // Use a custom background image instead of the gradient
            useCustomBackground: true,
            // Path to custom background image (if useCustomBackground is true)
            customBackgroundPath: "https://media.discordapp.net/attachments/1342651681095159979/1353187127449485502/image.png?ex=67e0bd38&is=67df6bb8&hm=c329818a9f3d6e0b5beba51e595f7fcaaf69b6edd98588bbd115f2114ea16962&=&format=webp&quality=lossless&width=1768&height=805",
            // Background overlay color (adds a colored overlay on top of the background image)
            overlayColor: "rgba(0, 0, 0, 0.5)",
            // Background image opacity (0.0 to 1.0)
            backgroundOpacity: 1.0
        }
    },
    
    // Server information settings
    serverInfo: {
        // Enable live player count updates from FiveM API
        livePlayerCount: true,
        // Update interval for player count in milliseconds (60000 = 1 minute)
        playerCountUpdateInterval: 60000,
        
        // Server announcements
        announcements: [
            {
                title: "Welcome to Server Name RP",
                content: "Enjoy your Server name or State Name experience in our immersive roleplay server!"
            }
        ],
        // Announcement rotation interval in milliseconds (10000 = 10 seconds)
        announcementInterval: 10000,
        
        // Changelogs
        changelogs: [
            {
                title: "Update v1.0.0",
                date: "March 31, 2025",
                content: "Original server Release."
            }
        ],
        
        // Server rules
        rules: [
            "Respect all players and staff members",
            "No breaking character in roleplay situations",
            "No cheating, exploiting, or using unauthorized mods",
            "Keep all roleplay realistic and immersive",
            "Follow proper police and medical roleplay procedures"
        ]
    }
};