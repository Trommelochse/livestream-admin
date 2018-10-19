import React, { Component } from 'react';
import './league-item.css';

class LeagueItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasChanged: false
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const updatedData = {};
    updatedData.priority = this.state.priority || this.props.priority;
    this.props.onUpdate(this.props.id, updatedData);
    this.setState({hasChanged: false});
  }

  onDelete() {
    this.props.onDelete(this.props)
  }

  onChangePriority(ev) {
    this.setState({
      priority: parseInt(ev.target.value, 10),
      hasChanged: true
    });
  }

  render() {
    return (
      <div className="LeagueItem">
        <div className="title">
          <span>{this.props.name}</span>
          <span className="info">{this.props.sport} - {this.props.scid}</span>
        </div>
        <form
          className="controls"
          onSubmit={ev => this.handleSubmit(ev)}
          >
          <div>
            <label>Priority</label>
            <input
              type="number"
              defaultValue={this.props.priority}
              onChange={this.onChangePriority.bind(this)}
            />  
          </div>
          <input
            className="update"
            type="submit"
            value="Update"
            disabled={!this.state.hasChanged}
          />
      </form>
      <button
        className="danger"
        onClick={this.onDelete.bind(this)}
        >
        x
      </button>
      </div>
    );
  }
}

export default LeagueItem;
