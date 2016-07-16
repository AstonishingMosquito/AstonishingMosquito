import React from 'react';
import 'whatwg-fetch';

export default (props) => {
  return (
    <form encType="multipart/form-data" onSubmit={props.onSubmit} >
      <input type="file" name="song"/>
      <input type="submit" />
    </form>
  )
}
