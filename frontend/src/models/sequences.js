export const canStart = sequence => ['idle', 'error'].includes(sequence.status) && sequence.sequenceItems.length > 0
export const canAddSequenceItems = sequence => ['idle', 'error'].includes(sequence.status)

