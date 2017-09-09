/**
*
* AddButton
*
*/

import React from 'react';
// import styled from 'styled-components';


function AddButton(props) {
  return (
    <a href={props.href} onClick={props.onClick}>+</a>
  );
}

AddButton.propTypes = {
  href: React.PropTypes.func,
  onClick: React.PropTypes.func.isRequired,
};

export default AddButton;
