import React from 'react'
import style from '@/config/style'
import _ from 'lodash'

const Title = function(props){
  const s = _.extend({
    background: style.bgColorPrimary,
    color: '#fff',
    lineHeight: '32px',
    fontSize:'16px',
    padding: '0 12px',
    cursor: 'pointer'
  }, props.style)
  return (<div style={s} onClick={props.onClick}>{props.title}</div>)
}

export default Title;
