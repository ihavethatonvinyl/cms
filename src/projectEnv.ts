type ProjectEnvVariablesType = Pick<
  Required<ImportMetaEnv>,
  "VITE_SCHEDULED_ID" | "VITE_STAGING_ID" | "VITE_LIVE_ID"
>;

// Environment Variable Template to Be Replaced at Runtime
const projectEnvVariables: ProjectEnvVariablesType = {
  VITE_SCHEDULED_ID: "${VITE_SCHEDULED_ID}",
  VITE_STAGING_ID: "${VITE_STAGING_ID}",
  VITE_LIVE_ID: "${VITE_LIVE_ID}",
};

// Returning the variable value from runtime or obtained as a result of the build
export const getProjectEnvVariables = (): {
  envVariables: ProjectEnvVariablesType;
} => {
  return {
    envVariables: {
      VITE_SCHEDULED_ID: !projectEnvVariables.VITE_SCHEDULED_ID.includes(
        "VITE_"
      )
        ? projectEnvVariables.VITE_SCHEDULED_ID
        : import.meta.env.VITE_SCHEDULED_ID ?? "135366167",
      VITE_STAGING_ID: !projectEnvVariables.VITE_STAGING_ID.includes("VITE_")
        ? projectEnvVariables.VITE_STAGING_ID
        : import.meta.env.VITE_STAGING_ID ?? "135366165",
      VITE_LIVE_ID: !projectEnvVariables.VITE_LIVE_ID.includes("VITE_")
        ? projectEnvVariables.VITE_LIVE_ID
        : import.meta.env.VITE_LIVE_ID ?? "135366163",
    },
  };
};
