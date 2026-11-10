
document.addEventListener("DOMContentLoaded", () => {
    const MAX_HISTORY_ITEMS = 10;

    function safeReadHistory(storageKey) {
        try {
            const savedHistory = localStorage.getItem(storageKey);
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (error) {
            return [];
        }
    }

    function saveCommandHistory(storageKey, command) {
        const trimmedCommand = command.trim();

        if (!trimmedCommand) {
            return [];
        }

        const previousHistory = safeReadHistory(storageKey);
        const uniqueHistory = previousHistory.filter(
            (storedCommand) => storedCommand.toLowerCase() !== trimmedCommand.toLowerCase()
        );
        const updatedHistory = [trimmedCommand, ...uniqueHistory].slice(0, MAX_HISTORY_ITEMS);

        try {
            localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
        } catch (error) {
            // Ignore localStorage failures (private mode / quota exceeded).
        }

        return updatedHistory;
    }

    function createHistoryList(storageKey, label) {
        const container = document.createElement("ul");
        container.classList.add("command-history");
        container.setAttribute("aria-label", label);

        const items = safeReadHistory(storageKey);

        if (items.length === 0) {
            const emptyItem = document.createElement("li");
            emptyItem.textContent = "No saved history yet.";
            container.appendChild(emptyItem);
            return container;
        }

        items.forEach((command) => {
            const item = document.createElement("li");
            item.textContent = command;
            container.appendChild(item);
        });

        return container;
    }

    // ----------------------------------------
    // 1. Contest search
    // ----------------------------------------

    const searchInput = document.getElementById("contest-search");
    const contestSection = document.getElementById("informations");

    if (searchInput && contestSection) {
        let emptyMessage = document.getElementById("contest-empty");

        // Create a message for searches with no matches.
        if (!emptyMessage) {
            emptyMessage = document.createElement("p");
            emptyMessage.id = "contest-empty";
            emptyMessage.setAttribute("role", "status");
            emptyMessage.setAttribute("aria-live", "polite");
            emptyMessage.classList.add("contest-empty");

            contestSection.parentNode.insertBefore(
                emptyMessage,
                contestSection.nextSibling
            );
        }

        const contestHistory = createHistoryList(
            "codeforces-contest-history",
            "Saved contest search history"
        );
        searchInput.parentNode.parentNode.insertBefore(
            contestHistory,
            searchInput.parentNode.nextSibling
        );

        function updateContestSearch() {
            const query = searchInput.value.trim().toLowerCase();
            const content = contestSection.textContent.toLowerCase();
            const matches = query === "" || content.includes(query);

            contestSection.hidden = !matches;
            emptyMessage.textContent = matches
                ? ""
                : "No matching contests found.";
        }

        // Filter the announcement when the user types.
        searchInput.addEventListener("input", updateContestSearch);

        searchInput.addEventListener("keydown", (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }

            if (event.key === "Enter") {
                const history = saveCommandHistory(
                    "codeforces-contest-history",
                    searchInput.value
                );

                contestHistory.innerHTML = "";

                if (history.length === 0) {
                    const emptyItem = document.createElement("li");
                    emptyItem.textContent = "No saved history yet.";
                    contestHistory.appendChild(emptyItem);
                    return;
                }

                history.forEach((command) => {
                    const item = document.createElement("li");
                    item.textContent = command;
                    contestHistory.appendChild(item);
                });
            }
        });
    }

    // ----------------------------------------
    // 2. Demo user data
    // ----------------------------------------

    // These are sample values, not live API data.
    const mockUsers = {
        jaikaran109: {
            rating: 408,
            contribution: 0,
            rank: "Newbie"
        },
        benq: {
            rating: 3792,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },
        vivaciousaubergine: {
            rating: 3647,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },
        jiangly: {
            rating: 3631,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },
        kevin114514: {
            rating: 3574,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },
        maroonrk: {
            rating: 3521,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },
        um_nik: {
            rating: 3000,
            contribution: 146,
            rank: "Legendary Grandmaster"
        }
    };

    // ----------------------------------------
    // 3. Find user elements
    // ----------------------------------------

    const handleInput = document.getElementById("handle-input");
    const findButton = document.getElementById("find-btn");
    const findContent = document.getElementById("find-content");

    // Stop safely if the required HTML elements are missing.
    if (!handleInput || !findButton || !findContent) {
        return;
    }

    // Create an area to display the result.
    let result = document.getElementById("find-result");

    if (!result) {
        result = document.createElement("div");
        result.id = "find-result";
        result.setAttribute("role", "status");
        result.setAttribute("aria-live", "polite");
        result.classList.add("find-result");
        findContent.appendChild(result);
    }

    const handleHistory = createHistoryList(
        "codeforces-handle-history",
        "Saved handle search history"
    );
    findContent.appendChild(handleHistory);

    // ----------------------------------------
    // 4. Find a user by handle
    // ----------------------------------------

    function findUser() {
        const handle = handleInput.value.trim();

        // Validate empty input.
        if (!handle) {
            result.textContent = "Please enter a Codeforces handle.";
            return;
        }

        // Save the last successful search in localStorage for future sessions.
        const history = saveCommandHistory("codeforces-handle-history", handle);
        handleHistory.innerHTML = "";

        if (history.length === 0) {
            const emptyItem = document.createElement("li");
            emptyItem.textContent = "No saved history yet.";
            handleHistory.appendChild(emptyItem);
            return;
        }

        history.forEach((command) => {
            const item = document.createElement("li");
            item.textContent = command;
            handleHistory.appendChild(item);
        });

        // Search without considering uppercase/lowercase.
        const normalizedHandle = handle.toLowerCase();
        const user = Object.prototype.hasOwnProperty.call(
            mockUsers,
            normalizedHandle
        )
            ? mockUsers[normalizedHandle]
            : undefined;

        // Display a message if the handle is not in our demo data.
        if (!user) {
            result.textContent =
                `No demo profile found for "${handle}". ` +
                "Try jaikaran109, benq, jiangly, or um_nik.";
            return;
        }

        // Display the matching user's information.
        result.textContent =
            `Handle: ${handle} | ` +
            `Rating: ${user.rating} | ` +
            `Contribution: ${user.contribution} | ` +
            `Rank: ${user.rank}`;
    }

    // Run the search when the Find button is clicked.
    findButton.addEventListener("click", findUser);

    // Also run the search when Enter is pressed.
    handleInput.addEventListener("keydown", (event) => {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }

        if (event.key === "Enter") {
            findUser();
        }
    });
});
