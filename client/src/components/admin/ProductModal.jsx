import { useState, useEffect } from 'react'
import { DialogPanel, DialogTitle, Dialog } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from '@heroicons/react/outline'
import adminService from '../../services/admin.service'
import { PRODUCT_CATEGORIES } from '../../utils/constants'
import toast from 'react-hot-toast'

const ProductModal = ({ isOpen, onClose, product }) => {
  const [images, setImages] = useState([])
  const queryClient = useQueryClient()
  const isEditMode = !!product //converting product var to boolean
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: product || {
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      category: '',
      brand: '',
      stock: '',
      features: [''],
      isActive: true,
      isFeatured: false,
      specifications: [{ key: '', value: '' }],
      replaceImages: false,
      tags: '',
    },
  })

  useEffect(() => {
    if (product) {
      reset(product)
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        brand: '',
        stock: '',
        features: [''],
        isActive: true,
        isFeatured: false,
        specifications: [{ key: '', value: '' }],
        replaceImages: false,
        tags: '',
      })
    }

    setImages([]);
  }, [product, reset])

  useEffect(() => {
  if (!isOpen) {
    setImages([]);
  }
  }, [isOpen])

  const createMutation = useMutation({
    mutationFn: adminService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      toast.success('Product created successfully')
      onClose()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      toast.success('Product updated successfully')
      onClose()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product')
    },
  })

  const handleAddSpecification = () => {
    reset({
      ...getValues(),
      specifications: [...getValues().specifications, { key: '', value: '' }],
    });
  };

  const handleRemoveSpecification = (index) => {
    const updatedSpecs = getValues().specifications.filter((_, i) => i !== index);
    reset({
      ...getValues(),
      specifications: updatedSpecs,
    });
  };

  const onSubmit = async (data) => {
    if (!isEditMode && images.length === 0) {
      toast.error('At least one image is required to create a product');
      return;
    }

    const formData = new FormData();
    
    // Append all form fields
    Object.keys(data).forEach((key) => {
      if (key === 'features') {
        data[key].forEach((feature) => {
          if (feature.trim()) formData.append('features[]', feature);
        });
      } else if (key === 'specifications') {
        data[key].forEach((spec) => {
          formData.append('specifications[]', JSON.stringify(spec));
        });
      } else if (key === 'replaceImages') {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    // Append images
    images.forEach((image) => {
      formData.append('images', image);
    });

    if (isEditMode) {
      updateMutation.mutate({ id: product._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input-field"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={4}
                      className="input-field"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="input-field"
                    >
                      <option value="">Select category</option>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SubCategory
                    </label>
                    <input
                      {...register('subCategory')}
                      className="input-field"
                      placeholder="Optional subcategory"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      {...register('brand')}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      {...register('sku', { required: 'SKU is required' })}
                      className="input-field"
                    />
                    {errors.sku && (
                      <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      {...register('stock', { 
                        required: 'Stock is required',
                        min: { value: 0, message: 'Stock cannot be negative' }
                      })}
                      className="input-field"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Specifications (Dynamic Inputs for Key-Value Pairs) */}
              <div>
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                
                {getValues('specifications').map((spec, index) => (
                  <div key={index} className="flex gap-4 mb-3">
                    <input
                      {...register(`specifications[${index}].key`, { required: 'Key is required' })}
                      className="input-field"
                      value={spec.key}
                      onChange={(e) => {
                        const updatedSpecs = [...getValues('specifications')];
                        updatedSpecs[index].key = e.target.value;
                        reset({ ...getValues(), specifications: updatedSpecs });
                      }}
                      placeholder="Specification Key"
                    />
                    <input
                      {...register(`specifications[${index}].value`, { required: 'Value is required' })}
                      className="input-field"
                      value={spec.value}
                      onChange={(e) => {
                        const updatedSpecs = [...getValues('specifications')];
                        updatedSpecs[index].value = e.target.value;
                        reset({ ...getValues(), specifications: updatedSpecs });
                      }}
                      placeholder="Specification Value"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="btn-secondary"
                >
                  Add Specification
                </button>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-medium mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price cannot be negative' }
                      })}
                      className="input-field"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compare Price (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('comparePrice', {
                        min: { value: 0, message: 'Compare price cannot be negative' }
                      })}
                      className="input-field"
                    />
                    {errors.comparePrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.comparePrice.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-medium mb-4">Images</h3>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input-field"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload multiple images. First image will be the main image.
                </p>
                {isEditMode && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      disabled={images.length === 0}
                      {...register('replaceImages')}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="replaceImages" className="text-sm text-gray-700">
                      Replace existing images
                    </label>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="input-field"
                  placeholder="e.g. tag1, tag2, tag3"
                />
              </div>

              {/* Options */}
              <div>
                <h3 className="text-lg font-medium mb-4">Options</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="btn-primary"
              >
                {createMutation.isLoading || updateMutation.isLoading
                  ? 'Saving...'
                  : isEditMode ? 'Update Product' : 'Create Product'
                }
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default ProductModal