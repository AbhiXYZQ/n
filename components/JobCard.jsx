'use client';

import { motion } from 'framer-motion';
import { Clock, DollarSign, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const JobCard = ({ job, onApply }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        job.isUrgent && "border-red-500/50 urgent-glow"
      )}>
        {job.isUrgent && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold">
              <Zap className="mr-1 h-3 w-3" fill="currentColor" />
              24H SOS
            </Badge>
          </div>
        )}
        
        <CardHeader>
          <div className="space-y-2">
            <Badge variant="outline">{job.category}</Badge>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {job.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="mr-1 h-4 w-4" />
              <span>${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.requiredSkills.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{job.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>
          
          <Button onClick={() => onApply(job)} className="w-full">
            Submit Proposal
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobCard;
