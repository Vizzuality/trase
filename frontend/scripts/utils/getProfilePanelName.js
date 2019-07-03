import invert from 'lodash/invert';
import { PROFILE_STEPS } from 'constants';

export default activeStep => invert(PROFILE_STEPS)[activeStep];
