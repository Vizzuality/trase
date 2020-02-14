import { connect } from 'react-redux';
import ModalComponent from 'legacy/modal.component';
import { appActions } from 'app/app.register';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

const mapStateToProps = state => ({
  modal: state.app.modal
});

const mapDispatchToProps = {
  onClose: () => appActions.closeStoryModal()
};
const methodProps = [{ name: 'getModal', compared: ['modal'], returned: ['modal'] }];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(ModalComponent, methodProps, Object.keys(mapDispatchToProps)));
