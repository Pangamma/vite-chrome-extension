import { persistPromptAsync } from "@src/utils/persistPrompt";
import { setStateAsyncFactory } from "@src/utils/stateSetter";
import React from "react";
import "./app.scss";

type ReleaseStatus = 'Unknown' | 'InProgress' | 'Halted' | 'Success' | 'Failed';

interface WatchedRelease {
  releaseId: string;
  status: ReleaseStatus;
  isActivelyChecking: boolean;
  isBeeping: boolean;
  apiUrl: string;
  releaseUrl: string;
  alarmUrls: string[];
  description: string;
}

interface DeploymentWatcherProps {
}

interface DeploymentWatcherState {
  releases: WatchedRelease[];
}

class DeploymentWatcher extends React.PureComponent<DeploymentWatcherProps, DeploymentWatcherState> {
  private setStateAsync = setStateAsyncFactory(this);

  constructor(props: DeploymentWatcherProps) {
    super(props);
    this.state = {
      releases: [
        {
          alarmUrls: ['', ''],
          apiUrl: '',
          description: 'Testing release',
          isActivelyChecking: true,
          isBeeping: true,
          releaseId: '',
          releaseUrl: '',
          status: 'InProgress'
        }
      ]
    };
  }

  private onClickAddRelease = async () => {
    const description = await persistPromptAsync('Release Details', 'Description');
    const releaseUrl = await persistPromptAsync('Release Details', 'Release URL');
    const alarmUrl = await persistPromptAsync('Release Details', 'Alarm URL');
    const releaseId = ''; // somehow fetch from release URL

    const release: WatchedRelease = {
      releaseId,
      description,
      alarmUrls: !!alarmUrl ? [alarmUrl] : [],
      isBeeping: false, isActivelyChecking: true,
      status: 'Unknown',
      apiUrl: '',
      releaseUrl: ''
    };

    await this.setStateAsync({ releases: this.state.releases.concat(release) });
  }

  private onClickRemoveRow = async (releaseId: string) => {
    const releases = this.state.releases.filter(x => x.releaseId !== releaseId);
    await this.setStateAsync({ releases });
  }

  private onClickSilenceBeeping = async (release: WatchedRelease) => {
    if (release.isBeeping) {
      const releases = this.state.releases.map(x => x.releaseId !== release.releaseId ? x : {
        ...release,
        isBeeping: false,
      });

      await this.setStateAsync({ releases });
    }
  }

  private onClickResumeQuerying = async (release: WatchedRelease) => {
    if (!release.isActivelyChecking) {
      const releases = this.state.releases.map(x => x.releaseId !== release.releaseId ? x : {
        ...release,
        isActivelyChecking: true,
        status: 'Unknown'
      } as WatchedRelease);

      await this.setStateAsync({ releases });
    }
  }

  public render() {
    const { releases } = this.state;

    return (
      <div className="page-deployment-watcher">
        <h1>Deployment Watcher</h1>
        <div className="c-controls">
          <button type="button" onClick={this.onClickAddRelease}>Add release</button>
        </div>
        <div className="tblWatchedItems">
          <table>
            <thead>
              <tr id="table-header">
                <th>Status</th>
                <th>Release Link</th>
                <th>Alarms Link(s)</th>
                <th>Description</th>
                <th>Beeping</th>
                <th>API Querying</th>
                <th>Remove Row</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release, index) => {

                return (
                  <tr>
                    <td className="f-status">{release.status || 'Loading...'}</td>
                    <td className="f-releaseUrl"><a href={release.releaseUrl} target="_blank">View Release</a></td>
                    <td className="f-alarmsUrl">{release.alarmUrls.map((alarmUrl, alarmIndex) => (
                      <a key={alarmIndex} href={alarmUrl} target="_blank">View Alarms<br /></a>
                    ))}</td>
                    <td className="f-desc">{release.description}</td>

                    <td className="f-btnSilence">
                      <button type="button"
                        disabled={!release.isBeeping}
                        onClick={() => this.onClickSilenceBeeping(release)}>
                        Silence
                      </button>
                    </td>
                    <td className="f-btnResume">
                      <button type="button"
                        disabled={release.isActivelyChecking}
                        onClick={() => this.onClickResumeQuerying(release)}>
                        Resume
                      </button>
                    </td>
                    <td className="f-btnRemoveRow">
                      <button type="button" onClick={() => this.onClickRemoveRow(release.releaseId)}>
                        Remove Row
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DeploymentWatcher;
