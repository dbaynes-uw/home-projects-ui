export function toggleProductSelection(product, pendingProducts) {
  const originalActive = pendingProducts.get(product.id)?.originalActive ?? !!product.active
  product.active = !product.active

  if (product.active === originalActive) {
    pendingProducts.delete(product.id)
  } else {
    pendingProducts.set(product.id, { id: product.id, active: product.active, originalActive })
  }
}

export function applyPendingProductSelections(vendors, pendingProducts) {
  vendors.forEach((vendor) => {
    if (!Array.isArray(vendor.products)) return
    vendor.products.forEach((product) => {
      const pending = pendingProducts.get(product.id)
      if (pending) product.active = pending.active
    })
  })
}
