import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useEffect, useState } from "react";
import { getProjectEnvVariables } from "../projectEnv";
import Snackbar from "@mui/material/Snackbar";

export type PublisherToolbarProps = { token?: string };
export default function PublisherToolbar(props: PublisherToolbarProps) {
  const [paused, setPaused] = useState<boolean>(true);
  const [message, setMessage] = useState<JSX.Element | null>(null);

  const { envVariables } = getProjectEnvVariables();

  useEffect(() => {
    if (props.token) {
      fetch(
        `https://api.github.com/repos/ihavethatonvinyl/blog/actions/workflows/${envVariables.VITE_SCHEDULED_ID}`,
        {
          headers: [["Authorization", `token ${props.token}`]],
        }
      ).then((response) => {
        if (response.ok) {
          response.json().then((j) => {
            setPaused(j.state !== "active");
          });
        }
      });
    }
  }, [paused, props, envVariables]);

  const toggleScheduledPause = () => {
    const action = paused ? "enable" : "disable";

    fetch(
      `https://api.github.com/repos/ihavethatonvinyl/blog/actions/workflows/${envVariables.VITE_SCHEDULED_ID}/${action}`,
      {
        method: "PUT",
        headers: [["Authorization", `token ${props.token}`]],
      }
    ).then((response) => {
      if (response.ok) {
        setPaused((prev) => !prev);
      }
    });
  };

  const triggerManualBuild = (env: "staging" | "live") => () => {
    const envar = `VITE_${env.toUpperCase()}_ID` as
      | "VITE_STAGING_ID"
      | "VITE_LIVE_ID";
    const wfid = envVariables[envar];

    fetch(
      `https://api.github.com/repos/ihavethatonvinyl/blog/actions/workflows/${wfid}/dispatches`,
      {
        method: "POST",
        headers: [["Authorization", `token ${props.token}`]],
        body: JSON.stringify({ ref: "main" }),
      }
    )
      .then((response) => {
        if (response.status === 204) {
          setMessage(<>The request to publish to {env} was accepted</>);
          return;
        }

        setMessage(
          <>
            The request to publish to {env} was not accepted (
            <em>got status {response.status}, expected 204</em>)
          </>
        );
      })
      .catch(() => {
        setMessage(<>An error occurred requesting a publish to {env}</>);
      });
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ padding: "1vh 1vw" }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={triggerManualBuild("staging")}
        disabled={!props.token}
      >
        Publish to Staging
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={triggerManualBuild("live")}
        disabled={!props.token}
      >
        Publish to Live Site (danger!)
      </Button>
      <Button
        variant="contained"
        onClick={toggleScheduledPause}
        disabled={!props.token}
        startIcon={paused ? <PlayArrowIcon /> : <PauseIcon />}
      >
        {paused ? "Resume " : "Pause "} scheduled builds
      </Button>
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
      >
        {message!}
      </Snackbar>
    </Stack>
  );
}
