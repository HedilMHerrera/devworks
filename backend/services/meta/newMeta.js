const addMetaRunningAndStillValid = (group) => {
  const startDate = group.startDate;
  const endDate = group.endDate;
  const now = new Date();
  const running = startDate <= now && endDate >= now;
  const stillValid = (startDate > now && endDate > now) || running;
  return { stillValid, running, ...group };
};

module.exports = { addMetaRunningAndStillValid };
