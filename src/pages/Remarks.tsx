import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Sparkles, Brain, Copy, RotateCcw } from 'lucide-react';

export const Remarks: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [aiRemark, setAiRemark] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateRemark = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter some text to analyze.",
      });
      return;
    }

    try {
      setLoading(true);
      const remark = await apiService.generateAIRemark(inputText);
      setAiRemark(remark);
      toast({
        title: "AI Analysis Generated",
        description: "Your AI-powered remark has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating AI remark:', error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Could not generate AI remark. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRemark = () => {
    if (aiRemark) {
      navigator.clipboard.writeText(aiRemark);
      toast({
        title: "Copied to clipboard",
        description: "AI remark has been copied to your clipboard.",
      });
    }
  };

  const handleClearAll = () => {
    setInputText('');
    setAiRemark('');
  };

  const sampleTexts = [
    {
      title: "Mangrove Project Analysis",
      content: "This mangrove restoration project covers 150 hectares in the coastal region. The project aims to restore degraded mangrove ecosystems and sequester approximately 1,200 tons of CO2 over 10 years. Community involvement includes local fishing communities and environmental groups. The project includes monitoring protocols for biodiversity and carbon measurements."
    },
    {
      title: "Seagrass Conservation Review",
      content: "Seagrass meadow conservation initiative spanning 85 hectares of underwater habitat. The project focuses on protecting existing seagrass beds from anchor damage and nutrient pollution. Estimated carbon sequestration of 800 tons CO2 equivalent over the project lifetime. Local marine protected area designation is being pursued to ensure long-term protection."
    },
    {
      title: "Blue Carbon Verification",
      content: "Technical verification report for coastal wetland restoration project. Field measurements indicate successful establishment of native vegetation with 78% survival rate. Carbon flux measurements show net sequestration of 15 tons CO2/hectare/year. Water quality improvements documented through reduced nitrogen levels. Community engagement includes 25 local stakeholders actively participating in monitoring activities."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Remarks</h1>
          <p className="text-muted-foreground">
            Generate intelligent insights and analysis for project evaluations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Project Details Input</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="input-text" className="text-sm font-medium mb-2 block">
                Enter project details, notes, or any text for AI analysis:
              </Label>
              <Textarea
                id="input-text"
                placeholder="Paste your project details, verification notes, or any content you'd like the AI to analyze and provide insights about..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleGenerateRemark}
                disabled={loading || !inputText.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Remark
                  </>
                )}
              </Button>

              <Button
                onClick={handleClearAll}
                variant="outline"
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Sample Content */}
            <div className="space-y-3 pt-4 border-t border-border/30">
              <h4 className="font-medium text-foreground">Sample Project Data:</h4>
              <div className="space-y-2">
                {sampleTexts.map((sample, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputText(sample.content)}
                    className="h-auto p-2 text-left justify-start whitespace-normal"
                    disabled={loading}
                  >
                    <div>
                      <p className="font-medium text-xs text-primary">{sample.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {sample.content.substring(0, 80)}...
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>AI Analysis & Insights</span>
              </div>
              {aiRemark && (
                <Button
                  onClick={handleCopyRemark}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiRemark ? (
              <div className="space-y-4">
                <div className="bg-accent/30 rounded-lg p-4 border border-border/50">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                    {aiRemark}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  ✨ AI-generated analysis powered by Gemini Pro
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="p-4 bg-accent/20 rounded-full mb-4">
                  <Brain className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready for AI Analysis
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Enter your project details in the input area and click "Generate AI Remark" 
                  to receive intelligent insights and analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Features Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">• Project Evaluation</p>
                  <p>Automated analysis of project viability and impact</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">• Compliance Review</p>
                  <p>Check against carbon credit standards and requirements</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">• Risk Assessment</p>
                  <p>Identify potential challenges and mitigation strategies</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">• Recommendations</p>
                  <p>Actionable insights for project improvement</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};