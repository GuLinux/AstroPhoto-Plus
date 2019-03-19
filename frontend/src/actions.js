import Sequences from './Sequences/actions';
import SequenceJobs from './SequenceJobs/actions';
import INDIServer from './INDI-Server/actions';
import { Notifications } from './Notifications/actions';
import INDIService from './INDI-Service/actions';
import Camera from './Camera/actions';
import Settings from './Settings/actions';
import Image from './Image/actions';
import Commands from './Commands/actions';
import { PlateSolving } from './PlateSolving/actions';
import { BackendSelection } from './BackendSelection/actions';



export const Actions = {
    Sequences,
    SequenceJobs,
    INDIServer,
    Notifications,
    INDIService,
    Camera,
    Settings,
    Image,
    Commands,
    PlateSolving,
    BackendSelection,
}

export default Actions
