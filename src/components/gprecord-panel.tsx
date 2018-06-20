import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'gprecord-panel',
  styleUrl: 'gprecord-panel.css',
  shadow: true
})
export class GPRecordPanel {

  @Prop() section: string;

  render() {
    return (
      <div class="panel" innerHTML={this.section}></div>
    );
  }
}