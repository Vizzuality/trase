import { connect } from 'react-redux';
import LayoutArrows from 'react-components/tool/layout-arrows/layout-arrows.component';
import { changeLayout } from 'actions/app.actions';

const mapStateToProps = state => ({
  toolLayout: state.toolLayers.toolLayout
});

const mapDispatchToProps = {
  changeLayout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutArrows);
