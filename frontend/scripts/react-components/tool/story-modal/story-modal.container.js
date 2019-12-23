import { connect } from 'react-redux';
import ModalComponent from 'react-components/tool/story-modal/modal.component';
import { closeStoryModal } from 'app/app.actions';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

const mapStateToProps = state => ({
  modal: state.app.modal
});

const mapDispatchToProps = {
  onClose: () => closeStoryModal()
};
const methodProps = [{ name: 'getModal', compared: ['modal'], returned: ['modal'] }];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(ModalComponent, methodProps, Object.keys(mapDispatchToProps)));
