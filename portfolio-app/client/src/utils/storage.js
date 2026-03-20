export const getProjects = () => {
  return JSON.parse(localStorage.getItem("projects")) || [];
};

export const saveProjects = (projects) => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

export const getPortfolios = () => {
  return JSON.parse(localStorage.getItem("portfolios")) || [];
};

export const savePortfolios = (portfolios) => {
  localStorage.setItem("portfolios", JSON.stringify(portfolios));
};