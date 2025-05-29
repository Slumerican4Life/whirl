
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Reply, MoreHorizontal, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  userVote?: 'like' | 'dislike' | null;
}

interface CommentsProps {
  videoId?: string;
  battleId?: string;
}

const Comments = ({ videoId, battleId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: {
        id: "1",
        username: "SlumKing",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      content: "This is fire! 🔥 Keep dropping those beats!",
      timestamp: "2 hours ago",
      likes: 12,
      dislikes: 1,
      userVote: null,
      replies: [
        {
          id: "1-1",
          user: {
            id: "2",
            username: "BeatMaster",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
          },
          content: "Facts! This is next level 💯",
          timestamp: "1 hour ago",
          likes: 5,
          dislikes: 0,
          userVote: null
        }
      ]
    },
    {
      id: "2",
      user: {
        id: "3",
        username: "RhymeQueen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b9b6c14e?w=150"
      },
      content: "Love the energy! Can't wait to see more from you 🎵",
      timestamp: "4 hours ago",
      likes: 8,
      dislikes: 0,
      userVote: null
    }
  ]);
  
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        id: "current",
        username: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      },
      content: newComment,
      timestamp: "now",
      likes: 0,
      dislikes: 0,
      userVote: null
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment("");
    toast.success("Comment posted!");
  };

  const handleVoteComment = (commentId: string, voteType: 'like' | 'dislike', isReply?: boolean, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies?.map(reply => 
            reply.id === commentId 
              ? { 
                  ...reply, 
                  likes: voteType === 'like' ? reply.likes + 1 : reply.likes,
                  dislikes: voteType === 'dislike' ? reply.dislikes + 1 : reply.dislikes,
                  userVote: voteType
                }
              : reply
          )
        };
      } else if (comment.id === commentId) {
        return {
          ...comment,
          likes: voteType === 'like' ? comment.likes + 1 : comment.likes,
          dislikes: voteType === 'dislike' ? comment.dislikes + 1 : comment.dislikes,
          userVote: voteType
        };
      }
      return comment;
    }));
  };

  const handleReply = (commentId: string) => {
    if (!replyText.trim()) return;
    
    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      user: {
        id: "current",
        username: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      },
      content: replyText,
      timestamp: "now",
      likes: 0,
      dislikes: 0,
      userVote: null
    };

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));
    
    setReplyText("");
    setReplyingTo(null);
    toast.success("Reply posted!");
  };

  const CommentItem = ({ comment, isReply = false, parentId }: { comment: Comment, isReply?: boolean, parentId?: string }) => (
    <div className={`${isReply ? 'ml-8' : ''} border-b border-gray-100 last:border-b-0 py-4`}>
      <div className="flex gap-3">
        <img
          src={comment.user.avatar}
          alt={comment.user.username}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.user.username}</span>
            <span className="text-xs text-gray-500">{comment.timestamp}</span>
          </div>
          <p className="text-sm mb-2">{comment.content}</p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVoteComment(comment.id, 'like', isReply, parentId)}
              className={`text-xs px-2 h-6 ${comment.userVote === 'like' ? 'text-green-500' : 'text-gray-500'}`}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {comment.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVoteComment(comment.id, 'dislike', isReply, parentId)}
              className={`text-xs px-2 h-6 ${comment.userVote === 'dislike' ? 'text-red-500' : 'text-gray-500'}`}
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              {comment.dislikes}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs px-2 h-6 text-gray-500"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
          
          {/* Reply input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Post
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              isReply={true} 
              parentId={comment.id} 
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="p-6" id="comments">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </h3>
      
      {/* Add Comment */}
      <div className="mb-6">
        <div className="flex gap-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
            alt="You"
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] mb-2"
            />
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="bg-whirl-purple hover:bg-whirl-deep-purple"
            >
              Post Comment
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-0">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      
      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </Card>
  );
};

export default Comments;
