
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Palette, Sparkles } from 'lucide-react';
import { ContentType, ContentField } from '@/types/lifeblocks';
import { useLifeBlocks } from '@/hooks/useLifeBlocks';

const contentFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['text', 'number', 'date', 'boolean', 'select', 'textarea']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const contentTypeSchema = z.object({
  name: z.string().min(1, 'Content type name is required'),
  icon: z.string().min(1, 'Icon is required'),
  fields: z.array(contentFieldSchema).min(1, 'At least one field is required'),
});

const lifeBlockSchema = z.object({
  name: z.string().min(1, 'LifeBlock name is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  contentTypes: z.array(contentTypeSchema).min(1, 'At least one content type is required'),
});

type LifeBlockFormData = z.infer<typeof lifeBlockSchema>;

const iconOptions = ['📚', '🎯', '💡', '🏃‍♂️', '🎨', '🍳', '🌱', '📊', '🔧', '🎵', '📸', '✈️', '🎮', '💼', '🏠', '❤️'];
const colorOptions = [
  { name: 'Blue', value: 'bg-blue-500', preview: 'bg-blue-100 border-blue-200' },
  { name: 'Green', value: 'bg-green-500', preview: 'bg-green-100 border-green-200' },
  { name: 'Purple', value: 'bg-purple-500', preview: 'bg-purple-100 border-purple-200' },
  { name: 'Pink', value: 'bg-pink-500', preview: 'bg-pink-100 border-pink-200' },
  { name: 'Orange', value: 'bg-orange-500', preview: 'bg-orange-100 border-orange-200' },
  { name: 'Red', value: 'bg-red-500', preview: 'bg-red-100 border-red-200' },
  { name: 'Yellow', value: 'bg-yellow-500', preview: 'bg-yellow-100 border-yellow-200' },
  { name: 'Indigo', value: 'bg-indigo-500', preview: 'bg-indigo-100 border-indigo-200' },
];

interface CreateLifeBlockFormProps {
  onSuccess?: () => void;
}

const CreateLifeBlockForm = ({ onSuccess }: CreateLifeBlockFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createLifeBlock } = useLifeBlocks();

  const form = useForm<LifeBlockFormData>({
    resolver: zodResolver(lifeBlockSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '📚',
      color: 'bg-blue-500',
      contentTypes: [{
        name: '',
        icon: '📝',
        fields: [{
          name: '',
          type: 'text',
          required: true,
          options: [],
        }],
      }],
    },
  });

  const { fields: contentTypeFields, append: appendContentType, remove: removeContentType } = useFieldArray({
    control: form.control,
    name: 'contentTypes',
  });

  const onSubmit = (data: LifeBlockFormData) => {
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const processedData = {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      contentTypes: data.contentTypes.map(ct => ({
        id: generateId(),
        name: ct.name,
        icon: ct.icon,
        fields: ct.fields.map(field => ({
          id: generateId(),
          name: field.name,
          type: field.type,
          required: field.required,
          options: field.options || [],
        })),
      })),
    };

    createLifeBlock(processedData)
      .then(() => {
        setIsOpen(false);
        form.reset();
        onSuccess?.();
      })
      .catch((error) => {
        console.error('Failed to create life block:', error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <Sparkles className="w-4 h-4" />
          Create LifeBlock
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Custom LifeBlock
          </DialogTitle>
          <DialogDescription className="text-lg">
            Design a personalized productivity category that fits your unique lifestyle and goals.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="w-5 h-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">LifeBlock Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Reading Journey, Fitness Goals, Recipe Collection" 
                            className="border-2 focus:border-blue-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Description</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief description of what this LifeBlock represents" 
                            className="border-2 focus:border-blue-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Choose an Icon</FormLabel>
                        <div className="grid grid-cols-8 gap-2">
                          {iconOptions.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => field.onChange(icon)}
                              className={`p-3 text-2xl border-2 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 ${
                                field.value === icon ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-200'
                              }`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Color Theme</FormLabel>
                        <div className="grid grid-cols-4 gap-3">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => field.onChange(color.value)}
                              className={`h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${color.preview} ${
                                field.value === color.value ? 'ring-2 ring-blue-400 scale-105' : ''
                              }`}
                              title={color.name}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Types */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Plus className="w-5 h-5 text-purple-600" />
                    Content Types
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendContentType({
                      name: '',
                      icon: '📝',
                      fields: [{
                        name: '',
                        type: 'text',
                        required: true,
                        options: [],
                      }],
                    })}
                    className="border-purple-200 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Content Type
                  </Button>
                </div>
                <CardDescription>
                  Define the types of content you want to track in this LifeBlock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contentTypeFields.map((contentType, contentTypeIndex) => (
                    <ContentTypeForm
                      key={contentType.id}
                      contentTypeIndex={contentTypeIndex}
                      form={form}
                      onRemove={() => removeContentType(contentTypeIndex)}
                      canRemove={contentTypeFields.length > 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Create LifeBlock
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const ContentTypeForm = ({ contentTypeIndex, form, onRemove, canRemove }: any) => {
  const { fields: fieldFields, append: appendField, remove: removeField } = useFieldArray({
    control: form.control,
    name: `contentTypes.${contentTypeIndex}.fields`,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Content Type {contentTypeIndex + 1}</CardTitle>
          {canRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`contentTypes.${contentTypeIndex}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Book, Recipe, Workout" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`contentTypes.${contentTypeIndex}.icon`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input placeholder="📝" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Fields</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendField({
                name: '',
                type: 'text',
                required: true,
                options: [],
              })}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Field
            </Button>
          </div>

          {fieldFields.map((field, fieldIndex) => (
            <FieldForm
              key={field.id}
              contentTypeIndex={contentTypeIndex}
              fieldIndex={fieldIndex}
              form={form}
              onRemove={() => removeField(fieldIndex)}
              canRemove={fieldFields.length > 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const FieldForm = ({ contentTypeIndex, fieldIndex, form, onRemove, canRemove }: any) => {
  const fieldType = form.watch(`contentTypes.${contentTypeIndex}.fields.${fieldIndex}.type`);

  return (
    <div className="border rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium">Field {fieldIndex + 1}</h5>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <FormField
          control={form.control}
          name={`contentTypes.${contentTypeIndex}.fields.${fieldIndex}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Field Name</FormLabel>
              <FormControl>
                <Input placeholder="Title, Author, Date..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`contentTypes.${contentTypeIndex}.fields.${fieldIndex}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Type</FormLabel>
              <FormControl>
                <select {...field} className="w-full px-3 py-2 border rounded-md">
                  <option value="text">Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="boolean">Yes/No</option>
                  <option value="select">Dropdown</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`contentTypes.${contentTypeIndex}.fields.${fieldIndex}.required`}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 pt-6">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="rounded"
                />
              </FormControl>
              <FormLabel className="text-xs">Required</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {fieldType === 'select' && (
        <FormField
          control={form.control}
          name={`contentTypes.${contentTypeIndex}.fields.${fieldIndex}.options`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Options (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Option 1, Option 2, Option 3"
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default CreateLifeBlockForm;
