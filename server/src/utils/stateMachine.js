// Simple status transition validator
// Prevents invalid transitions like CANCELLED -> READY

function isValidTransition(currentStatus, newStatus) {
  // If status is not changing, it's valid
  if (currentStatus === newStatus) {
    return true;
  }

  // From PLACED, order can move to PREPARING or CANCELLED
  if (currentStatus === "PLACED") {
    if (newStatus === "PREPARING" || newStatus === "CANCELLED") {
      return true;
    }
    return false;
  }

  // From PREPARING, order can move to READY or CANCELLED
  if (currentStatus === "PREPARING") {
    if (newStatus === "READY" || newStatus === "CANCELLED") {
      return true;
    }
    return false;
  }

  // From READY, order can move to CANCELLED
  if (currentStatus === "READY") {
    if (newStatus === "CANCELLED") {
      return true;
    }
    return false;
  }

  // CANCELLED orders cannot change status
  if (currentStatus === "CANCELLED") {
    return false;
  }

  return false;
}

module.exports = { isValidTransition };
