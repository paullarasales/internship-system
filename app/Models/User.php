<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'picture',
        'course',
        'coordinator_id',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class);
    }

    public function employerProfile()
    {
        return $this->hasOne(EmployerProfile::class);
    }

    public function internships()
    {
        return $this->hasMany(Internship::class, 'internship_user');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'student_id');
    }

    public function evaluations() {
        return $this->hasMany(Evaluation::class, 'evaluator_id');
    }

    public function verification()
    {
        return $this->hasOne(Verification::class);
    }

    public function companyApplication()
    {
        return $this->hasOne(CompanyApplication::class);
    }

    public function internshipRequirement()
    {
        return $this->hasOne(internshipRequirement::class);
    }

    // For coordinator
    public function instructors()
    {
        return $this->hasMany(User::class, 'coordinator_id')->where('role', 'instructor');
    }

    // For instructor
    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function coursesAsInstructor()
    {
        return $this->belongsToMany(Course::class, 'course_instructor', 'instructor_id', 'course_id');
    }
    public function coursesAsStudent()
    {
        return $this->belongsToMany(Course::class, 'course_student', 'student_id', 'course_id');
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_user');
    }

    // Groups where user is an instructor
    public function groupsManaged()
    {
        return $this->hasMany(Group::class, 'instructor_id');
    }
}
