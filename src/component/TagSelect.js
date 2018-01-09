import React from 'react'
import { Tag, Row, Col } from 'antd'
import _ from 'lodash'
import Title from '@/component/Title'
const { CheckableTag } = Tag

class TagRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.state = {selected: this.props.selected}
  }
  componentWillReceiveProps(nextProps) {
    this.setState({selected: nextProps.selected})
  }
  handleChange(checked,tag){
    if(checked){
      this.props.addTag(tag)
      this.setState({selected: tag.Id})
    }else{
      this.props.deleteTag(tag)
      this.setState({selected: 0})
    }
  }

  render() {
    return (
      <Row style={{borderBottom: '1px solid #ddd', margin: "6px 0",padding:"3px 0"}}>
        <Col span="4" style={{lineHeight:'28px',height: '28px'}}>{this.props.label}</Col>
        <Col span="20">{this.props.tags.map(tag=>{
          return <CheckableTag
            key={tag.TagName}
            checked={this.state.selected == tag.Id}
            onChange={checked=>{this.handleChange(checked,tag)}}
            > {tag.TagName} </CheckableTag>
        })}</Col>
      </Row>
    )
  }
}



class Main extends React.Component {
  constructor(props) {
    super(props);
    let selectedTags = {};
    _.each(this.props.selected, tag=>{
      selectedTags[tag.TagType] = tag.TagId
    })
    this.state= {
      selectedTags: selectedTags
    }
  }
  componentWillReceiveProps(nextProps) {
    let selectedTags = {};
    _.each(nextProps.selected, tag=>{
      selectedTags[tag.TagType] = tag.TagId
    })
    this.setState({
        selectedTags: selectedTags
    });
  }
  componentWillMount() {
    this.props.getTags()
  }
  render() {
    const tagGroups = _.groupBy(this.props.tags,'TagType')
    return (
      <div>
        <Title title= '标签'/>
        {_.map(tagGroups,(arr,key)=>{
          return (<TagRow selected={this.state.selectedTags[key]} key={key} tags={arr} addTag={this.props.addTag} deleteTag={this.props.deleteTag} label={key} /> )
        })}
      </div>
    )
  }
}

export default Main
