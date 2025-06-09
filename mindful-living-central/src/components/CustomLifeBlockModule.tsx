
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, BarChart3, Calendar, Activity, Sparkles, Filter } from 'lucide-react';
import { CustomLifeBlock, LifeBlockContent, ContentType } from '@/types/lifeblocks';
import { useLifeBlocks } from '@/hooks/useLifeBlocks';

interface CustomLifeBlockModuleProps {
  lifeBlock: CustomLifeBlock;
}

const CustomLifeBlockModule = ({ lifeBlock }: CustomLifeBlockModuleProps) => {
  const { addContent, updateContent, deleteContent } = useLifeBlocks();
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [viewingContent, setViewingContent] = useState<LifeBlockContent | null>(null);

  const handleAddContent = (contentData: Record<string, any>) => {
    if (selectedContentType) {
      addContent(lifeBlock.id, {
        contentTypeId: selectedContentType.id,
        data: contentData,
      });
      setIsAddingContent(false);
      setSelectedContentType(null);
    }
  };

  const groupedContents = lifeBlock.contents.reduce((acc, content) => {
    const contentType = lifeBlock.contentTypes.find(ct => ct.id === content.contentTypeId);
    if (contentType) {
      if (!acc[contentType.id]) {
        acc[contentType.id] = { contentType, contents: [] };
      }
      acc[contentType.id].contents.push(content);
    }
    return acc;
  }, {} as Record<string, { contentType: ContentType; contents: LifeBlockContent[] }>);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`text-4xl p-4 rounded-2xl ${lifeBlock.color} text-white shadow-xl`}>
              {lifeBlock.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{lifeBlock.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{lifeBlock.description}</p>
            </div>
          </div>
          <Dialog open={isAddingContent} onOpenChange={setIsAddingContent}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Choose Content Type
                </DialogTitle>
                <DialogDescription>
                  Select the type of content you want to add to this LifeBlock.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-3">
                {lifeBlock.contentTypes.map((contentType) => (
                  <Button
                    key={contentType.id}
                    variant="outline"
                    className="h-auto p-4 flex items-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition-all"
                    onClick={() => {
                      setSelectedContentType(contentType);
                      setIsAddingContent(false);
                    }}
                  >
                    <span className="text-2xl">{contentType.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{contentType.name}</div>
                      <div className="text-sm text-gray-500">{contentType.fields.length} fields</div>
                    </div>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{lifeBlock.contentTypes.length}</div>
                <div className="text-sm text-gray-600">Content Types</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{lifeBlock.contents.length}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(groupedContents).length}
                </div>
                <div className="text-sm text-gray-600">Active Types</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-sm text-orange-600 font-medium">
                  {new Date(lifeBlock.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Types Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Filter className="w-6 h-6 text-blue-600" />
          Content Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lifeBlock.contentTypes.map((contentType) => (
            <Card key={contentType.id} className="border-2 border-dashed hover:border-solid hover:border-blue-300 transition-all hover:shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">{contentType.icon}</div>
                <CardTitle className="text-lg">{contentType.name}</CardTitle>
                <CardDescription>
                  {groupedContents[contentType.id]?.contents.length || 0} items • {contentType.fields.length} fields
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedContentType(contentType)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add {contentType.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {Object.values(groupedContents).map(({ contentType, contents }) => (
          <div key={contentType.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{contentType.icon}</span>
              <h3 className="text-xl font-bold">{contentType.name}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {contents.length} items
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contents.map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  contentType={contentType}
                  onView={() => setViewingContent(content)}
                  onDelete={() => deleteContent(lifeBlock.id, content.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedContentType && (
        <AddContentDialog
          contentType={selectedContentType}
          isOpen={!!selectedContentType}
          onClose={() => setSelectedContentType(null)}
          onSave={handleAddContent}
        />
      )}

      {viewingContent && (
        <ViewContentDialog
          content={viewingContent}
          contentType={lifeBlock.contentTypes.find(ct => ct.id === viewingContent.contentTypeId)!}
          isOpen={!!viewingContent}
          onClose={() => setViewingContent(null)}
        />
      )}
    </div>
  );
};

const ContentCard = ({ content, contentType, onView, onDelete }: any) => {
  const getDisplayValue = (field: any, value: any) => {
    if (field.type === 'boolean') return value ? 'Yes' : 'No';
    if (field.type === 'date') return new Date(value).toLocaleDateString();
    return String(value || '');
  };

  const primaryField = contentType.fields[0];
  const primaryValue = content.data[primaryField?.name] || 'Untitled';

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base truncate font-semibold">
          {getDisplayValue(primaryField, primaryValue)}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(content.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onView} className="flex-1 hover:bg-blue-50">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AddContentDialog = ({ contentType, isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({});
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add {contentType.name}</DialogTitle>
          <DialogDescription>
            Fill in the details for your new {contentType.name.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {contentType.fields.map((field: any) => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-1">
                {field.name}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select...</option>
                  {field.options?.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={formData[field.name] || false}
                  onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                  className="rounded"
                />
              ) : (
                <Input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ViewContentDialog = ({ content, contentType, isOpen, onClose }: any) => {
  const getDisplayValue = (field: any, value: any) => {
    if (field.type === 'boolean') return value ? 'Yes' : 'No';
    if (field.type === 'date') return new Date(value).toLocaleDateString();
    return String(value || '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{contentType.icon}</span>
            {contentType.name} Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {contentType.fields.map((field: any) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-500">
                {field.name}
              </label>
              <p className="text-sm">{getDisplayValue(field, content.data[field.name])}</p>
            </div>
          ))}
          <div className="pt-2 text-xs text-gray-500">
            Created: {new Date(content.createdAt).toLocaleString()}
            {content.updatedAt !== content.createdAt && (
              <><br />Updated: {new Date(content.updatedAt).toLocaleString()}</>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomLifeBlockModule;
