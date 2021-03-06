let action = new Creep.Action('withdrawing');
module.exports = action;
action.isValidAction = function(creep){
    return (
        creep.data.creepType !== 'privateer' &&
        creep.sum < creep.carryCapacity &&
        (!creep.room.conserveForDefense || creep.room.relativeEnergyAvailable < 0.8)
    );
};
action.isValidTarget = function(target){
    return ( (target != null) && (target.store != null) && (target.store.energy > 0) );
};
action.newTarget = function(creep){
    return _.max([creep.room.storage, creep.room.terminal], 'charge');
};
action.work = function(creep){
    return creep.withdraw(creep.target, RESOURCE_ENERGY);
};
action.onAssignment = function(creep, target) {
    //if( SAY_ASSIGNMENT ) creep.say(String.fromCharCode(9738), SAY_PUBLIC);
    if( SAY_ASSIGNMENT ) creep.say(ACTION_SAY.WITHDRAWING, SAY_PUBLIC);
};
action.debounce = function(creep, outflowActions, callback, thisArg) {
    let shouldCall = false;
    if (creep.data.lastAction === 'storing' && creep.data.lastTarget === creep.room.storage.id) {
        // cycle detected
        shouldCall = _.some(outflowActions, a => a.newTarget(creep));
    } else {
        shouldCall = true;
    }

    if (shouldCall) {
        return _.invoke([thisArg], callback, this)[0];
    }

    return undefined;
};
