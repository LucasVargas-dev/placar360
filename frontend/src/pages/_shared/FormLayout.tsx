import { ReactNode } from 'react'
import {
  FormProvider,
  type FieldErrors,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form'
import { Button } from '@packages/components'

type FormLayoutVariant = 'card' | 'plain'

type FormLayoutProps<TFormValues extends Record<string, unknown>> = {
  form: UseFormReturn<TFormValues>
  onSubmit: SubmitHandler<TFormValues>
  onError?: (errors: FieldErrors<TFormValues>) => void
  title?: string
  description?: string
  showDefaultActions?: boolean
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  variant?: FormLayoutVariant
  className?: string
  formClassName?: string
  footerSlot?: ReactNode
  children: ReactNode
}

const baseVariantClasses: Record<FormLayoutVariant, string> = {
  card: 'bg-white rounded-2xl shadow-lg border border-orange-100 p-8 space-y-6',
  plain: 'space-y-6',
}

export function FormLayout<TFormValues extends Record<string, unknown>>({
  form,
  onSubmit,
  onError,
  title,
  description,
  showDefaultActions = true,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  onCancel,
  isSubmitting = false,
  variant = 'card',
  className = '',
  formClassName = '',
  footerSlot,
  children,
}: FormLayoutProps<TFormValues>) {
  const containerClassName = [
    baseVariantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className={containerClassName}>
      {(title || description) && (
        <header className="space-y-2">
          {title ? (
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm text-gray-600">{description}</p>
          ) : null}
        </header>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className={['flex flex-col', formClassName].filter(Boolean).join(' ')}
        >
          <div className="flex flex-col gap-4">{children}</div>

          {showDefaultActions ? (
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                isDisabled={isSubmitting}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                {submitLabel}
              </Button>
            </div>
          ) : null}

          {footerSlot}
        </form>
      </FormProvider>
    </div>
  )
}


