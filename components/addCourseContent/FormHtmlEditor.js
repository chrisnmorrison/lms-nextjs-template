import React, {Component} from 'react'

export default class FormHtmlEditor extends Component {
  constructor(props) {
    super(props)
    if (document) {
      this.quill = require('react-quill')
    }
  }

  render() {
    const Quill = this.quill
    if (Quill) {
      return (
        <Quill
          onChange={this.props.onChange}
          theme="bubble"
          value={this.props.value}
        />
      )
    } else {
      return null
    }
  }
}