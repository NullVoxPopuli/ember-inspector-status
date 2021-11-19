import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { useFunction } from 'ember-resources';

import { Octokit } from 'octokit';

export default class ReleaseInfoComponent extends Component {
  isUpToDate = (version) => {
    if (!version) return;

    let cleaned = this.latestRelease?.tag_name?.replace(/^v/, '');
    let cleanedVersion = version.replace(/^v/, '');
    return cleanedVersion === cleaned;
  };

  @cached
  get octokit() {
    return new Octokit({});
  }

  releasesRequest = useFunction(this, () => {
    return this.octokit.request('GET /repos/emberjs/ember-inspector/releases', {
      owner: 'emberjs',
      repo: 'ember-inspector',
      // always latest
      per_page: 1,
    });
  });

  get releases() {
    return this.releasesRequest.value?.data;
  }

  get isLoading() {
    return !this.latestRelease;
  }

  get latestRelease() {
    return this.releases?.[0];
  }
}
