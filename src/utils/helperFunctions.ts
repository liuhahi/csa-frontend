export function getPatchStatusColour(patchStatus: string): string {
  switch (patchStatus) {
    case 'partial_fixed':
      return 'warning'
    case 'patching':
      return 'info'
    case 'failed':
      return 'danger'
    case 'fixed':
      return 'primary'
    default:
      return 'info'
  }
}

export function getPatchStatusName(patchString: string): string {
  switch (patchString) {
    case 'partial_fixed':
      return 'Partially Fixed'
    case 'patching': 
      return 'Patching'
    case 'failed':
      return 'Failed'
    case 'fixed':
      return 'Fixed'
    default:
      return '-'
  }
}