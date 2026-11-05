const contestSearch = document.querySelector("#contest-search");
const contestItems = [...document.querySelectorAll("[data-contest-item]")];
const noContestMessage = document.querySelector("#contest-empty");

contestSearch.addEventListener("input", () => {
  const query = contestSearch.value.trim().toLocaleLowerCase();
  const matches = contestItems.filter((item) => {
    const visible = item.textContent.toLocaleLowerCase().includes(query);
    item.hidden = !visible;
    return visible;
  });
  noContestMessage.hidden = query.length === 0 || matches.length > 0;
});

const mockUsers = {
  jaikaran109: { rating: 408, contribution: 0, rank: "Newbie" },
  benq: { rating: 3792, contribution: 100, rank: "Legendary Grandmaster" },
  jiangly: { rating: 3631, contribution: 100, rank: "Legendary Grandmaster" },
  um_nik: { rating: 3204, contribution: 146, rank: "Legendary Grandmaster" },
};
const handleInput = document.querySelector("#handle-input");
const findButton = document.querySelector("#find-btn");
const findResult = document.querySelector("#find-result");

function findUser() {
  const handle = handleInput.value.trim();
  if (!handle) {
    findResult.textContent = "Enter a handle to search.";
    return;
  }
  const user = mockUsers[handle.toLocaleLowerCase()];
  findResult.textContent = user
    ? `${handle} "${user.rank}", rating ${user.rating}, contribution ${user.contribution}.`
    : `No mock profile found for "${handle}". Try jaikaran109, Benq, jiangly, or Um_nik.`;
}
findButton.addEventListener("click", findUser);
handleInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") findUser();
});
