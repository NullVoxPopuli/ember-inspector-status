import Component from '@glimmer/component';
import { useFunction } from 'ember-resources';

const FIREFOX_URL =
  'https://addons.mozilla.org/api/v5/addons/addon/ember-inspector';

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeStyle: 'long',
});

const parseTime = (zTime) => {
  if (!zTime) {
    return [];
  }
  zTime = zTime.replace(/Z$/, '');
  let [date, time] = zTime.split('T');
  let [year, month, day] = date.split('-');
  let [hour, minute, second] = time.split(':');
  let result = [year, month - 1, day, hour, minute, second];

  return new Date(Date.UTC(...result));
};

export default class InspectorStatus extends Component {
  date = (date) => DateFormatter.format(parseTime(date));

  firefox = useFunction(this, async () => {
    let response = await fetch(FIREFOX_URL);
    let data = await response.json();

    console.log(data);
    return data;
  });

  get firefoxVersion() {
    return this.firefox.value?.current_version.version;
  }

  get revertInstructions() {
    let tagName = '[[target version]]';

    return (
      `git clone https://github.com/emberjs/ember-inspector.git` +
      `\ngit fetch -all -tags` +
      `\ngit checkout tags/${tagName} -b ${tagName}` +
      `\nyarn install` +
      `\nyarn build`
    );
  }
}
