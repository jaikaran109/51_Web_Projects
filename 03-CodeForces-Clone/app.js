document.addEventListener("DOMContentLoaded", () => {
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
            emptyMessage.textContent = "No matching contests found.";
            emptyMessage.hidden = true;
            emptyMessage.classList.add("contest-empty");

            contestSection.parentNode.insertBefore(
                emptyMessage,
                contestSection.nextSibling
            );
        }

        // Filter the announcement when the user types.
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            const content = contestSection.textContent.toLowerCase();

            const matches =
                query === "" || content.includes(query);

            contestSection.hidden = !matches;
            emptyMessage.hidden = matches;
        });
    }

    // ----------------------------------------
    // 2. Demo user data
    // ----------------------------------------

    // These are sample values, not live API data.
    const mockUsers = {
        "jaikaran109": {
            rating: 408,
            contribution: 0,
            rank: "Newbie"
        },

        "benq": {
            rating: 3792,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },

        "vivaciousaubergine": {
            rating: 3647,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },

        "jiangly": {
            rating: 3631,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },

        "kevin114514": {
            rating: 3574,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },

        "maroonrk": {
            rating: 3521,
            contribution: 0,
            rank: "Legendary Grandmaster"
        },

        "um_nik": {
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

    // ----------------------------------------
    // 4. Find a user by handle
    // ----------------------------------------

    function findUser() {
        const handle = handleInput.value.trim();

        // Validate empty input.
        if (!handle) {
            result.textContent =
                "Please enter a Codeforces handle.";
            return;
        }

        // Search without considering uppercase/lowercase.
        const user = mockUsers[handle.toLowerCase()];

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
        if (event.key === "Enter") {
            findUser();
        }
    });
});