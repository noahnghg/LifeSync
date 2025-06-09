
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus, Sparkles, TrendingUp, Calendar, Activity } from 'lucide-react';
import { useLifeBlocks } from '@/hooks/useLifeBlocks';
import CreateLifeBlockForm from './CreateLifeBlockForm';

interface LifeBlocksManagerProps {
  onSelectLifeBlock: (lifeBlockId: string) => void;
}

const LifeBlocksManager = ({ onSelectLifeBlock }: LifeBlocksManagerProps) => {
  const { lifeBlocks, deleteLifeBlock } = useLifeBlocks();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Custom LifeBlocks</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Personal Productivity Universe
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create and manage personalized categories that adapt to your unique lifestyle and goals
        </p>
        <CreateLifeBlockForm />
      </div>

      {lifeBlocks.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 max-w-2xl mx-auto border border-blue-100">
            <div className="text-7xl mb-6 animate-bounce">🧩</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Build Something Amazing?</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Create your first custom LifeBlock to organize your unique productivity needs. 
              Whether it's tracking reading progress, managing workout routines, or collecting recipes - 
              the possibilities are endless!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="text-2xl mb-2">📚</div>
                <div className="font-medium">Reading Lists</div>
                <div className="text-gray-500">Track books, progress, ratings</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="text-2xl mb-2">🏃‍♂️</div>
                <div className="font-medium">Fitness Goals</div>
                <div className="text-gray-500">Workouts, metrics, achievements</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="text-2xl mb-2">🍳</div>
                <div className="font-medium">Recipe Collection</div>
                <div className="text-gray-500">Ingredients, steps, notes</div>
              </div>
            </div>
            <CreateLifeBlockForm />
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{lifeBlocks.length}</div>
                <div className="text-sm text-blue-700 font-medium">LifeBlocks</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {lifeBlocks.reduce((sum, lb) => sum + lb.contentTypes.length, 0)}
                </div>
                <div className="text-sm text-green-700 font-medium">Content Types</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {lifeBlocks.reduce((sum, lb) => sum + lb.contents.length, 0)}
                </div>
                <div className="text-sm text-purple-700 font-medium">Total Items</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {lifeBlocks.filter(lb => lb.contents.length > 0).length}
                </div>
                <div className="text-sm text-orange-700 font-medium">Active</div>
              </CardContent>
            </Card>
          </div>

          {/* LifeBlocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lifeBlocks.map((lifeBlock) => (
              <Card key={lifeBlock.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`text-3xl p-3 rounded-xl ${lifeBlock.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {lifeBlock.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold truncate">{lifeBlock.name}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {lifeBlock.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {lifeBlock.contentTypes.slice(0, 3).map((contentType) => (
                      <Badge key={contentType.id} variant="secondary" className="text-xs">
                        {contentType.icon} {contentType.name}
                      </Badge>
                    ))}
                    {lifeBlock.contentTypes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{lifeBlock.contentTypes.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{lifeBlock.contentTypes.length}</span>
                      <span className="text-gray-500">types</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{lifeBlock.contents.length}</span>
                      <span className="text-gray-500">items</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    Created {new Date(lifeBlock.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => onSelectLifeBlock(lifeBlock.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteLifeBlock(lifeBlock.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LifeBlocksManager;
