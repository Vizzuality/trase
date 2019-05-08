import connect from 'base/connect';
// import ModalComponent from 'components/tool/modal.component';
import { closeStoryModal } from 'actions/app.actions';

const mapMethodsToState = state => ({
  getModal: state.app.modal
});

const mapViewCallbacksToActions = () => ({
  onClose: () => closeStoryModal()
});

export default connect(
  // ModalComponent,
  mapMethodsToState,
  mapViewCallbacksToActions
);
