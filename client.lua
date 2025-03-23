-- Wait for the player to spawn
AddEventHandler('playerSpawned', function()
    -- Small delay to ensure everything is loaded
    Citizen.Wait(1000)
    
    -- Shut down the loading screen
    ShutdownLoadingScreenNui()
end)

-- Alternative method to shut down loading screen when player is fully loaded
Citizen.CreateThread(function()
    -- Wait until player is fully loaded
    while not NetworkIsPlayerActive(PlayerId()) do
        Citizen.Wait(100)
    end
    
    -- Additional wait to ensure everything is loaded
    Citizen.Wait(2000)
    
    -- Shut down the loading screen
    ShutdownLoadingScreenNui()
end)

-- Debug command to manually shut down loading screen if needed
RegisterCommand('closeloading', function()
    ShutdownLoadingScreenNui()
    print('Loading screen manually shut down')
end, false)

-- Send loading progress to NUI
Citizen.CreateThread(function()
    -- Register for loading screen events
    RegisterNUICallback('loadingScreenStarted', function()
        -- This is called when the loading screen starts
        SendNUIMessage({
            eventName = 'loadProgress',
            loadFraction = 0.0,
            loadingText = 'Starting up...'
        })
    end)

    -- Update loading progress periodically
    while true do
        -- Get current loading progress from FiveM
        local loadingScreenProgress = GetGameTimer() / 15000.0 -- Approximation
        local actualProgress = GetLoadingScreenProgressValue()
        
        -- Use actual progress if available, otherwise use approximation
        local progress = (actualProgress > 0) and (actualProgress / 100.0) or loadingScreenProgress
        
        -- Clamp progress between 0 and 1
        progress = math.min(math.max(progress, 0.0), 1.0)
        
        -- Send progress to NUI
        SendNUIMessage({
            eventName = 'loadProgress',
            loadFraction = progress,
            loadingText = GetLoadingScreenText()
        })
        
        -- Check if loading is complete
        if progress >= 1.0 then
            Citizen.Wait(1000)
            break
        end
        
        Citizen.Wait(100)
    end
end)