export const canStart = (sequence, gear) => {
    if(! gear) {
        return false;
    }
    if(! gear.camera || ! gear.camera.connected) {
        return false;
    }
    if( gear.filterWheel && ! gear.filterWheel.connected) {
        return false;
    }
    return ['idle', 'stopped', 'error'].includes(sequence.status) && sequence.sequenceItems.length > 0;
}


