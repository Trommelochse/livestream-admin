import React, { Component } from 'react';
import './league-item.css';

class LeagueItem extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const updatedData = {}
    updatedData.priority = this.state.priority || this.props.priority;
    updatedData.active = this.state.active || this.props.active;
    this.props.onUpdate(this.props.id, updatedData);
  }

  onToggleActive() {
    const active = this.state.active ?
      false : this.props.active ?
        false : true;
    this.setState({active})
  }

  render() {
    return (
      <div className="LeagueItem">
        <input
          defaultChecked={this.props.active}
          type="checkbox"
          className="toggle-status"
          onChange={this.onToggleActive.bind(this)}
        />
        <div className="title">{ this.props.name }</div>
        <form
          className="controls"
          onSubmit={ev => this.handleSubmit(ev)}
          >
          <label>Priority</label>
          <input
            type="number"
            defaultValue={this.props.priority}
            onChange={ev => this.setState({priority: parseInt(ev.target.value, 10)})}
          />
          <input type="submit" value="Update"/>
      </form>
      </div>
    );
  }
}

export default LeagueItem;
